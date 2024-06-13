import { Box, Flex, Heading, VStack, Text, IconButton, useColorMode } from "@chakra-ui/react";
import { FaSun, FaMoon, FaTasks } from "react-icons/fa";

const Index = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex height="100vh" flexDirection="column">
      {/* Header */}
      <Flex as="header" width="100%" padding="4" boxShadow="md" justifyContent="space-between" alignItems="center">
        <Heading as="h1" size="lg">To-Do App</Heading>
        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
        />
      </Flex>

      <Flex flex="1">
        {/* Sidebar */}
        <Box as="nav" width="250px" padding="4" boxShadow="md">
          <VStack align="start" spacing="4">
            <Heading as="h2" size="md">Task Lists</Heading>
            <Flex align="center">
              <FaTasks />
              <Text marginLeft="2">Personal</Text>
            </Flex>
            <Flex align="center">
              <FaTasks />
              <Text marginLeft="2">Work</Text>
            </Flex>
            <Flex align="center">
              <FaTasks />
              <Text marginLeft="2">Shopping</Text>
            </Flex>
          </VStack>
        </Box>

        {/* Main Content Area */}
        <Box as="main" flex="1" padding="4">
          <Heading as="h2" size="md" marginBottom="4">Tasks</Heading>
          <VStack align="start" spacing="4">
            <Text>Task 1</Text>
            <Text>Task 2</Text>
            <Text>Task 3</Text>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Index;