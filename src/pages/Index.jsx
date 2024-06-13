import { Box, Flex, Heading, VStack, Text, IconButton, useColorMode, Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel, Input, Select, Button } from "@chakra-ui/react";
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
          <Tabs>
            <TabList>
              <Tab>Today Task</Tab>
              <Tab>All Task</Tab>
              <Tab>Create Task</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack align="start" spacing="4">
                  <Text>Today's Task 1</Text>
                  <Text>Today's Task 2</Text>
                  <Text>Today's Task 3</Text>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack align="start" spacing="4">
                  <Text>All Task 1</Text>
                  <Text>All Task 2</Text>
                  <Text>All Task 3</Text>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack align="start" spacing="4" as="form">
                  <FormControl id="task-name" isRequired>
                    <FormLabel>Task Name</FormLabel>
                    <Input placeholder="Enter task name" />
                  </FormControl>
                  <FormControl id="importance" isRequired>
                    <FormLabel>Importance</FormLabel>
                    <Select placeholder="Select importance">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                  </FormControl>
                  <FormControl id="scheduled-time" isRequired>
                    <FormLabel>Scheduled Time</FormLabel>
                    <Input type="datetime-local" />
                  </FormControl>
                  <FormControl id="estimated-time" isRequired>
                    <FormLabel>Estimated Time to Complete</FormLabel>
                    <Input type="number" placeholder="Enter estimated time in hours" />
                  </FormControl>
                  <FormControl id="category" isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select placeholder="Select category">
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="shopping">Shopping</option>
                    </Select>
                  </FormControl>
                  <Button colorScheme="blue" type="submit">Create Task</Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Index;