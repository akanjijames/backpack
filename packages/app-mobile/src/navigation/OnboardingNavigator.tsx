import type { Blockchain, WalletDescriptor } from "@coral-xyz/common";
import type { StackScreenProps } from "@react-navigation/stack";

import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import * as Linking from "expo-linking";

import {
  BACKEND_API_URL,
  BACKPACK_FEATURE_XNFT,
  getCreateMessage,
  getAuthMessage,
  getBlockchainFromPath,
  DISCORD_INVITE_LINK,
  toTitleCase,
  TWITTER_LINK,
  UI_RPC_METHOD_KEYRING_STORE_CREATE,
  UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE,
  UI_RPC_METHOD_KEYRING_VALIDATE_MNEMONIC,
  UI_RPC_METHOD_FIND_WALLET_DESCRIPTOR,
  UI_RPC_METHOD_SIGN_MESSAGE_FOR_PUBLIC_KEY,
  UI_RPC_METHOD_USERNAME_ACCOUNT_CREATE,
  UI_RPC_METHOD_KEYRING_STORE_KEEP_ALIVE,
  XNFT_GG_LINK,
} from "@coral-xyz/common";
import { useBackgroundClient } from "@coral-xyz/recoil";
import { createStackNavigator } from "@react-navigation/stack";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";

import {
  BottomSheetHelpModal,
  HelpModalMenuButton,
} from "@components/BottomSheetHelpModal";
import { ErrorMessage } from "@components/ErrorMessage";
import {
  AvalancheIcon,
  BscIcon,
  CheckBadge,
  CosmosIcon,
  DiscordIcon,
  EthereumIcon,
  PolygonIcon,
  SolanaIcon,
  TwitterIcon,
  WidgetIcon,
} from "@components/Icon";
import { StyledTextInput } from "@components/StyledTextInput";
import {
  ActionCard,
  BaseCheckBoxLabel,
  Box,
  CheckBox,
  FullScreenLoading,
  Header,
  Margin,
  MnemonicInputFields,
  PasswordInput,
  PrimaryButton,
  Screen,
  StyledText,
  SubtextParagraph,
  WelcomeLogoHeader,
} from "@components/index";
import { useAuthentication } from "@hooks/useAuthentication";
import { useTheme } from "@hooks/useTheme";
import { OnboardingProvider, useOnboardingData } from "@lib/OnboardingProvider";

const { base58 } = ethers.utils;

function Cell({ children, style }: any): JSX.Element {
  return (
    <View style={[{ alignSelf: "flex-start", marginBottom: 12 }, style]}>
      {children}
    </View>
  );
}

function Network({
  id,
  label,
  enabled,
  selected,
  onSelect,
}: {
  id: Blockchain;
  label: string;
  enabled: boolean;
  selected: boolean;
  onSelect: (b: Blockchain) => void;
}) {
  function getIcon(id: string): JSX.Element | null {
    switch (id) {
      case "ethereum":
        return <EthereumIcon width={24} height={24} />;
      case "solana":
        return <SolanaIcon width={24} height={24} />;
      case "polygon":
        return <PolygonIcon width={24} height={24} />;
      case "bsc":
        return <BscIcon width={24} height={24} />;
      case "cosmos":
        return <CosmosIcon width={24} height={24} />;
      case "valanache":
        return <AvalancheIcon width={24} height={24} />;
      default:
        return null;
    }
  }

  return (
    <View style={{ flex: 1, margin: 6 }}>
      <ActionCard
        text={label}
        disabled={!enabled}
        icon={getIcon(id)}
        textAdornment={selected ? <CheckBadge /> : ""}
        onPress={() => {
          if (enabled) {
            onSelect(id);
          }
        }}
      />
    </View>
  );
}

export const useSignMessageForWallet = (mnemonic?: string | true) => {
  const background = useBackgroundClient();

  const signMessageForWallet = async (
    walletDescriptor: WalletDescriptor,
    message: string
  ) => {
    const blockchain = getBlockchainFromPath(walletDescriptor.derivationPath);
    return await background.request({
      method: UI_RPC_METHOD_SIGN_MESSAGE_FOR_PUBLIC_KEY,
      params: [
        blockchain,
        walletDescriptor.publicKey,
        ethers.utils.base58.encode(Buffer.from(message, "utf-8")),
        [mnemonic, [walletDescriptor.derivationPath]],
      ],
    });
  };

  return signMessageForWallet;
};

function maybeRender(
  condition: boolean,
  fn: () => JSX.Element
): JSX.Element | null {
  if (condition) {
    return fn() as JSX.Element;
  }

  return null;
}

function getWaitlistId() {
  return undefined;
}

type OnboardingStackParamList = {
  CreateOrImportWallet: undefined;
  OnboardingUsername: undefined;
  KeyringTypeSelector: undefined;
  MnemonicInput: undefined;
  SelectBlockchain: undefined;
  ImportAccounts: undefined;
  CreatePassword: undefined;
  Finished: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

function OnboardingScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: any;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Screen
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Margin bottom={24}>
        <Header text={title} />
        {subtitle ? <SubtextParagraph>{subtitle}</SubtextParagraph> : null}
      </Margin>
      {children}
    </Screen>
  );
}

function OnboardingCreateOrImportWalletScreen({
  navigation,
}: StackScreenProps<OnboardingStackParamList, "CreateOrImportWallet">) {
  const insets = useSafeAreaInsets();
  const { setOnboardingData } = useOnboardingData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const handlePresentModalPress = () => {
    setIsModalVisible((last) => !last);
  };

  return (
    <>
      <Screen
        style={[
          styles.container,
          {
            marginTop: insets.top,
            marginBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <HelpModalMenuButton onPress={handlePresentModalPress} />
        <Margin top={48} bottom={24}>
          <WelcomeLogoHeader />
        </Margin>
        <View
          style={{
            padding: 16,
            alignItems: "center",
          }}
        >
          <PrimaryButton
            label="Create a new wallet"
            onPress={() => {
              setOnboardingData({ action: "create" });
              navigation.push("OnboardingUsername");
            }}
          />
          <Margin top={8}>
            <SubtextParagraph
              onPress={() => {
                setOnboardingData({ action: "import" });
                navigation.push("MnemonicInput");
              }}
            >
              I already have a wallet
            </SubtextParagraph>
          </Margin>
        </View>
      </Screen>
      <BottomSheetHelpModal
        isVisible={isModalVisible}
        resetVisibility={() => {
          setIsModalVisible(() => false);
        }}
      />
    </>
  );
}

function OnboardingKeyringTypeSelectorScreen({
  navigation,
}: StackScreenProps<OnboardingStackParamList, "KeyringTypeSelector">) {
  const { onboardingData, setOnboardingData } = useOnboardingData();
  const { action } = onboardingData;

  return (
    <OnboardingScreen title="Keyring Selector">
      {maybeRender(action === "create", () => (
        <>
          <Header text="Create a new wallet" />
          <SubtextParagraph>
            Choose a wallet type. If you're not sure, using a recovery phrase is
            the most common option.
          </SubtextParagraph>
        </>
      ))}
      {maybeRender(action === "import", () => (
        <>
          <Header text="Import an existing wallet" />
          <SubtextParagraph>
            Choose a method to import your wallet.
          </SubtextParagraph>
        </>
      ))}
      {maybeRender(action === "recover", () => (
        <>
          <Header text="Recover a username" />
          <SubtextParagraph>
            Choose a method to recover your username.
          </SubtextParagraph>
        </>
      ))}
      <Box
        style={{
          padding: 16,
          alignItems: "center",
        }}
      >
        <PrimaryButton
          label={`${toTitleCase(action as string)} with recovery phrase`}
          onPress={() => {
            setOnboardingData({ keyringType: "mnemonic" });
            navigation.push("MnemonicInput");
          }}
        />
        <Box style={{ paddingVertical: 8 }}>
          <SubtextParagraph
            onPress={() => {
              setOnboardingData({ keyringType: "ledger" });
              navigation.push("SelectBlockchain");
            }}
          >
            {action === "recover"
              ? "Recover using a hardware wallet"
              : "I have a hardware wallet"}
          </SubtextParagraph>
        </Box>
      </Box>
    </OnboardingScreen>
  );
}

function OnboardingUsernameScreen({
  navigation,
}: StackScreenProps<
  OnboardingStackParamList,
  "OnboardingUsername"
>): JSX.Element {
  const { onboardingData, setOnboardingData } = useOnboardingData();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={78}
    >
      <OnboardingScreen title="Claim your username">
        <View style={{ flex: 1 }}>
          <Margin bottom={12}>
            <SubtextParagraph>
              Others can see and find you by this username, and it will be
              associated with your primary wallet address.
            </SubtextParagraph>
          </Margin>
          <Margin bottom={12}>
            <SubtextParagraph>
              Choose wisely if you'd like to remain anonymous.
            </SubtextParagraph>
          </Margin>
          <SubtextParagraph>Have fun!</SubtextParagraph>
        </View>
        <View>
          <Margin bottom={18}>
            <StyledTextInput
              autoFocus
              placeholder="@Username"
              returnKeyType="next"
              value={onboardingData.username ?? ""}
              onChangeText={(username) => setOnboardingData({ username })}
            />
          </Margin>
          <PrimaryButton
            disabled={!onboardingData.username?.length}
            label="Continue"
            onPress={() => {
              navigation.push("MnemonicInput");
            }}
          />
        </View>
      </OnboardingScreen>
    </KeyboardAvoidingView>
  );
}

function OnboardingMnemonicInputScreen({
  navigation,
}: StackScreenProps<OnboardingStackParamList, "MnemonicInput">) {
  const { onboardingData, setOnboardingData } = useOnboardingData();
  const { action } = onboardingData;
  const readOnly = action === "create";

  const background = useBackgroundClient();
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([
    ...Array(12).fill(""),
  ]);

  const [error, setError] = useState<string>();
  const [checked, setChecked] = useState(false);

  const mnemonic = mnemonicWords.map((f) => f.trim()).join(" ");
  // Only enable copy all fields populated
  const copyEnabled = mnemonicWords.find((w) => w.length < 3) === undefined;
  // Only allow next if checkbox is checked in read only and all fields are populated
  const nextEnabled = (!readOnly || checked) && copyEnabled;

  const subtitle = readOnly
    ? "This is the only way to recover your account if you lose your device. Write it down and store it in a safe place."
    : "Enter your 12 or 24-word secret recovery mnemonic to add an existing wallet.";

  //
  // Handle pastes of 12 or 24 word mnemonics.
  //
  useEffect(() => {
    // const onPaste = (e: any) => {
    //   const words = e.clipboardData.getData("text").split(" ");
    //   if (words.length !== 12 && words.length !== 24) {
    //     // Not a valid mnemonic length
    //     return;
    //   }
    //   // Prevent the paste from populating an individual input field with
    //   // all words
    //   e.preventDefault();
    //   setMnemonicWords(words);
    // };
    if (!readOnly) {
      // Enable pasting if not readonly
      // window.addEventListener("paste", onPaste);
    } else {
      // If read only we can generate a random mnemnic
      generateRandom();
    }
    return () => {
      if (!readOnly) {
        // window.removeEventListener("paste", onPaste);
      }
    };
  }, []);

  //
  // Validate the mnemonic and call the onNext handler.
  //
  const next = () => {
    background
      .request({
        method: UI_RPC_METHOD_KEYRING_VALIDATE_MNEMONIC,
        params: [mnemonic],
      })
      .then((isValid: boolean) => {
        setOnboardingData({ mnemonic });
        return isValid
          ? navigation.push("SelectBlockchain")
          : setError("Invalid secret recovery phrase");
      });
  };

  //
  // Generate a random mnemonic and populate state.
  //
  const generateRandom = () => {
    background
      .request({
        method: UI_RPC_METHOD_KEYRING_STORE_MNEMONIC_CREATE,
        params: [mnemonicWords.length === 12 ? 128 : 256],
      })
      .then((m: string) => {
        const words = m.split(" ");
        setMnemonicWords(words);
      });
  };

  return (
    <OnboardingScreen title="Secret recovery phrase" subtitle={subtitle}>
      <MnemonicInputFields
        mnemonicWords={mnemonicWords}
        onChange={readOnly ? undefined : setMnemonicWords}
      />
      {maybeRender(!readOnly, () => (
        <StyledText>
          Use a {mnemonicWords.length === 12 ? "24" : "12"}-word recovery
          mnemonic
        </StyledText>
      ))}
      {maybeRender(readOnly, () => (
        <Margin bottom={12}>
          <BaseCheckBoxLabel
            label="I saved my secret recovery phrase"
            value={checked}
            onPress={() => {
              setChecked(!checked);
            }}
          />
        </Margin>
      ))}
      {maybeRender(Boolean(error), () => (
        <ErrorMessage for={{ message: error }} />
      ))}
      <PrimaryButton
        disabled={!nextEnabled}
        label={action === "create" ? "Next" : "Import"}
        onPress={next}
      />
    </OnboardingScreen>
  );
}

function OnboardingBlockchainSelectScreen({
  navigation,
}: StackScreenProps<OnboardingStackParamList, "SelectBlockchain">) {
  const [data, setData] = useState({});
  const background = useBackgroundClient();
  const { onboardingData, setOnboardingData } = useOnboardingData();
  const {
    blockchain,
    mnemonic,
    action,
    keyringType,
    blockchainOptions,
    signedWalletDescriptors,
  } = onboardingData;

  const selectedBlockchains = [
    ...new Set(
      signedWalletDescriptors.map((s) =>
        getBlockchainFromPath(s.derivationPath)
      )
    ),
  ];

  // useEffect(() => {
  //   // Reset blockchain keyrings on certain changes that invalidate the addresses
  //   // and signatures that they might contain
  //   // e.g. user has navigated backward through the onboarding flow
  //   setOnboardingData({
  //     signedWalletDescriptors: [],
  //   });
  // }, [action, keyringType, mnemonic, setOnboardingData]);

  const handleBlockchainClick = async (blockchain: Blockchain) => {
    setData({ step: "start", selectedBlockchains, blockchain });
    if (selectedBlockchains.includes(blockchain)) {
      // Blockchain is being deselected
      setOnboardingData({
        blockchain: null,
        signedWalletDescriptors: signedWalletDescriptors.filter(
          (s) => getBlockchainFromPath(s.derivationPath) !== blockchain
        ),
      });
    } else {
      setData({ step: "else", keyringType, action });
      // Blockchain is being selected
      if (keyringType === "ledger" || action === "import") {
        // If wallet is a ledger, step through the ledger onboarding flow
        // OR if action is an import then open the drawer with the import accounts
        // component
        setOnboardingData({ blockchain });
        // setOpenDrawer(true);
      } else if (action === "create") {
        setData({ step: "action create", action });
        const walletDescriptor = await background.request({
          method: UI_RPC_METHOD_FIND_WALLET_DESCRIPTOR,
          params: [blockchain, 0, mnemonic],
        });

        setData({ step: "walletDescriptor complete" });

        const params = [
          blockchain,
          walletDescriptor.publicKey,
          base58.encode(
            Buffer.from(getCreateMessage(walletDescriptor.publicKey), "utf-8")
          ),
          [mnemonic, [walletDescriptor.derivationPath]],
        ];

        setData({ step: "collect params", params });

        const signature = await background.request({
          method: UI_RPC_METHOD_SIGN_MESSAGE_FOR_PUBLIC_KEY,
          params,
        });

        setData({ step: "after signature request", signature });

        setOnboardingData({
          signedWalletDescriptors: [
            ...signedWalletDescriptors,
            {
              ...walletDescriptor,
              signature,
            },
          ],
        });
      }
    }
  };

  return (
    <OnboardingScreen
      title="Which network would you like Backpack to use?"
      subtitle="You can always add additional networks later through the settings menu."
    >
      <FlatList
        numColumns={2}
        data={blockchainOptions}
        keyExtractor={(item) => item.id}
        extraData={selectedBlockchains}
        scrollEnabled={false}
        initialNumToRender={blockchainOptions.length}
        renderItem={({ item }) => {
          return (
            <Network
              id={item.id}
              selected={selectedBlockchains.includes(item.id)}
              enabled={item.enabled}
              label={item.label}
              onSelect={handleBlockchainClick}
            />
          );
        }}
      />
      <ScrollView>
        <Text>{JSON.stringify(data, null, 2)}</Text>
        <Text>
          {JSON.stringify(
            { keyringType, blockchain, mnemonic, signedWalletDescriptors },
            null,
            2
          )}
        </Text>
      </ScrollView>
      <PrimaryButton
        disabled={selectedBlockchains.length === 0}
        label="Next"
        onPress={() => {
          navigation.push("CreatePassword");
        }}
      />
    </OnboardingScreen>
  );
}

type CreatePasswordFormData = {
  password: string;
  passwordConfirmation: string;
  agreedToTerms: boolean;
};

function OnboardingCreatePasswordScreen({
  navigation,
}: StackScreenProps<OnboardingStackParamList, "CreatePassword">) {
  const { setOnboardingData } = useOnboardingData();

  const { control, handleSubmit, formState, watch } =
    useForm<CreatePasswordFormData>();
  const { errors, isValid } = formState;

  const onSubmit = ({ password }: CreatePasswordFormData) => {
    setOnboardingData({ password, complete: true });
    navigation.push("Finished");
  };

  // TODO(peter) some fk'd up shit is happening here where the hook claims to be invalid when it's not
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={78}
    >
      <OnboardingScreen
        title="Create a password"
        subtitle="It should be at least 8 characters. You'll need this to unlock Backpack."
      >
        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <Margin bottom={12}>
            <PasswordInput
              name="password"
              placeholder="Password"
              control={control}
              rules={{
                required: "You must specify a password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
            />
            <ErrorMessage for={errors.password} />
          </Margin>
          <PasswordInput
            name="passwordConfirmation"
            placeholder="Confirm Password"
            control={control}
            rules={{
              validate: (val: string) => {
                if (val !== watch("password")) {
                  return "Passwords do not match";
                }
              },
            }}
          />
          <ErrorMessage for={errors.passwordConfirmation} />
        </View>
        <View style={{ marginBottom: 24 }}>
          <CheckBox
            name="agreedToTerms"
            control={control}
            label="I agree to the terms of service"
          />
          <ErrorMessage for={errors.agreedToTerms} />
        </View>
        <PrimaryButton
          // disabled={!isValid}
          label="Next (TODO fix isValid)"
          onPress={handleSubmit(onSubmit)}
        />
      </OnboardingScreen>
    </KeyboardAvoidingView>
  );
}

// TODO(peter) import flow OnboardingAccount/ImportAccounts
function OnboardingImportAccountsScreen({
  navigation,
}: StackScreenProps<OnboardingStackParamList, "ImportAccounts">) {
  // const { onboardingData} = useOnboardingData();
  // const { mnemonic, blockchain } = onboardingData;
  // const allowMultiple = false;

  return (
    <Screen style={styles.container}>
      <View>
        <StyledText style={{ fontSize: 24, marginBottom: 12 }}>
          Secret Recovery Phrase
        </StyledText>
      </View>
      <View style={{ flexDirection: "row" }}>
        <PrimaryButton
          label="Import Accounts"
          onPress={() => {
            navigation.push("CreatePassword");
          }}
        />
      </View>
    </Screen>
  );
}

function OnboardingFinishedScreen() {
  const background = useBackgroundClient();
  const { authenticate } = useAuthentication();
  const { onboardingData } = useOnboardingData();
  const [isValid, setIsValid] = useState(false);

  const {
    password,
    mnemonic,
    username,
    inviteCode,
    isAddingAccount,
    userId,
    signedWalletDescriptors,
  } = onboardingData;

  const keyringInit = {
    mnemonic,
    signedWalletDescriptors,
  };

  useEffect(() => {
    (async () => {
      // This is a mitigation to ensure the keyring store doesn't lock before
      // creating the user on the server.
      //
      // Would be better (though probably not a priority atm) to ensure atomicity.
      // E.g. we could generate the UUID here on the client, create the keyring store,
      // and only then create the user on the server. If the server fails, then
      // rollback on the client.
      //
      // An improvement for the future!
      if (isAddingAccount) {
        await background.request({
          method: UI_RPC_METHOD_KEYRING_STORE_KEEP_ALIVE,
          params: [],
        });
      }
      const { id, jwt } = await createUser();
      createStore(id, jwt);
    })();
  }, []);

  //
  // Create the user in the backend
  //
  async function createUser(): Promise<{ id: string; jwt: string }> {
    // If userId is provided, then we are onboarding via the recover flow.
    if (userId) {
      // Authenticate the user that the recovery has a JWT.
      // Take the first keyring init to fetch the JWT, it doesn't matter which
      // we use if there are multiple.
      const { derivationPath, publicKey, signature } =
        keyringInit.signedWalletDescriptors[0];
      const authData = {
        blockchain: getBlockchainFromPath(derivationPath),
        publicKey,
        signature,
        message: getAuthMessage(userId),
      };
      const { jwt } = await authenticate(authData!);
      return { id: userId, jwt };
    }

    // If userId is not provided and an invite code is not provided, then
    // this is dev mode.
    if (!inviteCode) {
      return { id: uuidv4(), jwt: "" };
    }

    //
    // If we're down here, then we are creating a user for the first time.
    //
    const body = JSON.stringify({
      username,
      inviteCode,
      waitlistId: getWaitlistId?.(),
      blockchainPublicKeys: keyringInit.signedWalletDescriptors.map((b) => ({
        blockchain: getBlockchainFromPath(b.derivationPath),
        publicKey: b.publicKey,
        signature: b.signature,
      })),
    });

    try {
      const res = await fetch(`${BACKEND_API_URL}/users`, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(await res.json());
      }

      return await res.json();
    } catch (err) {
      console.error("OnboardingNavigator:createUser::error", err);
      throw new Error("error creating account");
    }
  }

  //
  // Create the local store for the wallets
  //
  async function createStore(uuid: string, jwt: string) {
    try {
      if (isAddingAccount) {
        // Add a new account if needed, this will also create the new keyring
        // store
        await background.request({
          method: UI_RPC_METHOD_USERNAME_ACCOUNT_CREATE,
          params: [username, keyringInit, uuid, jwt],
        });
      } else {
        // Add a new keyring store under the new account
        await background.request({
          method: UI_RPC_METHOD_KEYRING_STORE_CREATE,
          params: [username, password, keyringInit, uuid, jwt],
        });
      }
      setIsValid(true);
    } catch (err) {
      console.error("OnboardingNavigator:createStore::error", err);
      // if (
      //   confirm("There was an issue setting up your account. Please try again.")
      // ) {
      // window.location.reload();
      // }
    }
  }

  return !isValid ? (
    <FullScreenLoading />
  ) : (
    <OnboardingScreen
      title="You've set up Backpack!"
      subtitle="Now get started exploring what your Backpack can do."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {BACKPACK_FEATURE_XNFT ? (
          <Cell style={{ paddingRight: 6 }}>
            <ActionCard
              icon={<WidgetIcon />}
              text="Browse the xNFT library"
              onPress={() => Linking.openURL(XNFT_GG_LINK)}
            />
          </Cell>
        ) : null}
        <Cell style={{ paddingLeft: 6 }}>
          <ActionCard
            icon={<TwitterIcon />}
            text="Follow us on Twitter"
            onPress={() => Linking.openURL(TWITTER_LINK)}
          />
        </Cell>
        <Cell>
          <ActionCard
            icon={<DiscordIcon />}
            text="Join the Discord community"
            onPress={() => Linking.openURL(DISCORD_INVITE_LINK)}
          />
        </Cell>
      </View>
      <PrimaryButton disabled={false} label="Finish" onPress={console.log} />
    </OnboardingScreen>
  );
}

export default function OnboardingNavigator(): JSX.Element {
  const theme = useTheme();
  return (
    <OnboardingProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="CreateOrImportWallet"
          component={OnboardingCreateOrImportWalletScreen}
        />
        <Stack.Group
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.custom.colors.background,
              shadowColor: "transparent",
            },
            headerTintColor: theme.custom.colors.fontColor,
            headerTitle: "",
            headerShown: true,
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="KeyringTypeSelector"
            component={OnboardingKeyringTypeSelectorScreen}
          />
          <Stack.Screen
            name="OnboardingUsername"
            component={OnboardingUsernameScreen}
          />
          <Stack.Screen
            name="MnemonicInput"
            component={OnboardingMnemonicInputScreen}
          />
          <Stack.Screen
            name="SelectBlockchain"
            component={OnboardingBlockchainSelectScreen}
          />
          <Stack.Screen
            name="ImportAccounts"
            component={OnboardingImportAccountsScreen}
          />
          <Stack.Screen
            name="CreatePassword"
            component={OnboardingCreatePasswordScreen}
          />
          <Stack.Screen name="Finished" component={OnboardingFinishedScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </OnboardingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
});
