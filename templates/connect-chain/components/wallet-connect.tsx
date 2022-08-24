import React, { MouseEventHandler, ReactNode } from "react";
import {
  Box,
  Button,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { WalletStatus } from "./types";
import { IoWallet } from "react-icons/io5";
import { ConnectWalletType } from "./types";

export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  icon,
  onClickConnectBtn,
}: ConnectWalletType) => {
  return (
    <Button
      minW="fit-content"
      colorScheme="primary"
      size="lg"
      isLoading={isLoading}
      isDisabled={isDisabled}
      onClick={onClickConnectBtn}
    >
      <Icon as={icon ? icon : IoWallet} mr={2} />
      {buttonText ? buttonText : "Connect Wallet"}
    </Button>
  );
};

export const Disconnect = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={onClick} />
  );
};

export const Connected = ({
  userInfoCard,
  buttonText,
  onClick,
}: {
  userInfoCard: ReactNode;
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Stack
      spacing={{ base: 2, sm: 3 }}
      alignItems="center"
      justifyContent="center"
      borderRadius="lg"
      bg={useColorModeValue("whiteAlpha.100", "whiteAlpha.50")}
      boxShadow={useColorModeValue(
        "inset 0 0 12px -5px #d3d3d3",
        "inset 0 0 14px -7px #828282"
      )}
      w="full"
      maxW={{ base: "full", md: "sm", lg: "xs" }}
      p={4}
    >
      {userInfoCard}
      <ConnectWalletButton
        buttonText={buttonText}
        onClickConnectBtn={onClick}
      />
    </Stack>
  );
};

export const Connecting = () => {
  return <ConnectWalletButton isLoading={true} />;
};

export const Rejected = ({
  buttonText,
  wordOfWarning,
}: {
  buttonText: string;
  wordOfWarning?: string;
}) => {
  return (
    <Stack maxW={{ base: "full", lg: 80 }} spacing={2}>
      <Box>
        <ConnectWalletButton buttonText={buttonText} isDisabled={true} />
      </Box>
      <Stack
        isInline={true}
        borderRadius="md"
        bg={useColorModeValue("orange.200", "orange.300")}
        color="blackAlpha.900"
        p={4}
        spacing={1}
      >
        <Icon as={FiAlertTriangle} mt={1} />
        <Text>
          <Text fontWeight="semibold" as="span">
            Warning:&ensp;
          </Text>
          {wordOfWarning}
        </Text>
      </Stack>
    </Stack>
  );
};

export const NotExist = ({ buttonText }: { buttonText: string }) => {
  return <ConnectWalletButton buttonText={buttonText} isDisabled={true} />;
};

export const WalletConnectComponent = ({
  walletStatus,
  disconnect,
  connecting,
  connected,
  rejected,
  notExist,
}: {
  walletStatus: WalletStatus;
  disconnect: ReactNode;
  connecting: ReactNode;
  connected: ReactNode;
  rejected: ReactNode;
  notExist: ReactNode;
}) => {
  switch (walletStatus) {
    case WalletStatus.NotInit:
      return <>{disconnect}</>;
    case WalletStatus.Loading:
      return <>{connecting}</>;
    case WalletStatus.Loaded:
      return <>{connected}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
