import { Box, Flex, Heading, VStack, Text, IconButton, useColorMode, Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel, Input, Select, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { FaSun, FaMoon, FaTasks, FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";

const Index = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterImportance, setFilterImportance] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const handleCreateTask = (event) => {
    event.preventDefault();
    const form = event.target;
    const newTask = {
      id: Date.now(),
      name: form["task-name"].value,
      importance: form["importance"].value,
      scheduledTime: form["scheduled-time"].value,
      estimatedTime: form["estimated-time"].value,
      category: form["category"].value,
      freeText: form["free-text"].value, // Add this line
    };
    setTasks([...tasks, newTask]);
    form.reset();
  };

  const handleUpdateTask = (event) => {
    event.preventDefault();
    const form = event.target;
    const updatedTask = {
      ...selectedTask,
      name: form["task-name"].value,
      importance: form["importance"].value,
      scheduledTime: form["scheduled-time"].value,
      estimatedTime: form["estimated-time"].value,
      category: form["category"].value,
      freeText: form["free-text"].value, // Add this line
    };
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setSelectedTask(null);
    onClose();
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    onOpen();
  };

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
            <Flex align="center">
              <FaTasks />
              <Text marginLeft="2">Projects</Text>
            </Flex>
            <Flex align="center">
              <FaTasks />
              <Text marginLeft="2">Kids</Text>
            </Flex>
          </VStack>
        </Box>

        {/* Main Content Area */}
        <Box as="main" flex="1" padding="4">
          <Flex mb="4" justifyContent="space-between">
            <FormControl width="30%">
              <FormLabel>Filter by Importance</FormLabel>
              <Select placeholder="All" onChange={(e) => setFilterImportance(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </FormControl>
            <FormControl width="30%">
              <FormLabel>Filter by Day</FormLabel>
              <Input type="date" onChange={(e) => setFilterDay(e.target.value)} />
            </FormControl>
            <FormControl width="30%">
              <FormLabel>Filter by Category</FormLabel>
              <Select placeholder="All" onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="projects">Projects</option>
                <option value="kids">Kids</option>
              </Select>
            </FormControl>
          </Flex>
          <Tabs>
            <TabList>
              <Tab>Today Task</Tab>
              <Tab>All Task</Tab>
              <Tab>Create Task</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack align="start" spacing="4">
                  {tasks.filter(task => new Date(task.scheduledTime).toDateString() === new Date().toDateString())
                    .filter(task => {
                      const taskDate = new Date(task.scheduledTime).toDateString();
                      const filterDate = new Date(filterDay).toDateString();
                      return (
                        (filterImportance === "" || task.importance === filterImportance) &&
                        (filterDay === "" || taskDate === filterDate) &&
                        (filterCategory === "" || task.category === filterCategory)
                      );
                    }).map((task, index) => (
                    <Box
                      key={index}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      p="4"
                      mb="4"
                      bg={task.importance === 'high' ? '#E19093' : task.importance === 'medium' ? '#FFE0BD' : '#D9EAD3'}
                    >
                      <Text fontWeight="bold">{task.name}</Text>
                      <Text>Importance: {task.importance}</Text>
                      <Text>Scheduled Time: {new Date(task.scheduledTime).toLocaleString()}</Text>
                      <Text>Estimated Time: {task.estimatedTime} hours</Text>
                      <Text>Category: {task.category}</Text>
                      <Text>Free Text: {task.freeText}</Text>
                      <Flex mt="2">
                        <IconButton aria-label="Edit task" icon={<FaEdit />} onClick={() => openTaskModal(task)} mr="2" />
                        <IconButton aria-label="Delete task" icon={<FaTrash />} onClick={() => handleDeleteTask(task.id)} />
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack align="start" spacing="4">
                  {tasks.filter(task => {
                      const taskDate = new Date(task.scheduledTime).toDateString();
                      const filterDate = new Date(filterDay).toDateString();
                      return (
                        (filterImportance === "" || task.importance === filterImportance) &&
                        (filterDay === "" || taskDate === filterDate) &&
                        (filterCategory === "" || task.category === filterCategory)
                      );
                    }).map((task, index) => (
                    <Box
                      key={index}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      p="4"
                      mb="4"
                      bg={task.importance === 'high' ? '#E19093' : task.importance === 'medium' ? '#FFE0BD' : '#D9EAD3'}
                    >
                      <Text fontWeight="bold">{task.name}</Text>
                      <Text>Importance: {task.importance}</Text>
                      <Text>Scheduled Time: {new Date(task.scheduledTime).toLocaleString()}</Text>
                      <Text>Estimated Time: {task.estimatedTime} hours</Text>
                      <Text>Category: {task.category}</Text>
                      <Text>Free Text: {task.freeText}</Text>
                      <Flex mt="2">
                        <IconButton aria-label="Edit task" icon={<FaEdit />} onClick={() => openTaskModal(task)} mr="2" />
                        <IconButton aria-label="Delete task" icon={<FaTrash />} onClick={() => handleDeleteTask(task.id)} />
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack align="start" spacing="4" as="form" onSubmit={handleCreateTask}>
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
                      <option value="projects">Projects</option>
                      <option value="kids">Kids</option>
                    </Select>
                  </FormControl>
                  <FormControl id="free-text">
                    <FormLabel>Free Text</FormLabel>
                    <Input placeholder="Enter any additional details" />
                  </FormControl>
                  <Button colorScheme="blue" type="submit">Create Task</Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>

      {/* Task Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTask && (
              <VStack align="start" spacing="4" as="form" onSubmit={handleUpdateTask}>
                <FormControl id="task-name" isRequired>
                  <FormLabel>Task Name</FormLabel>
                  <Input defaultValue={selectedTask.name} />
                </FormControl>
                <FormControl id="importance" isRequired>
                  <FormLabel>Importance</FormLabel>
                  <Select defaultValue={selectedTask.importance}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </FormControl>
                <FormControl id="scheduled-time" isRequired>
                  <FormLabel>Scheduled Time</FormLabel>
                  <Input type="datetime-local" defaultValue={selectedTask.scheduledTime} />
                </FormControl>
                <FormControl id="estimated-time" isRequired>
                  <FormLabel>Estimated Time to Complete</FormLabel>
                  <Input type="number" defaultValue={selectedTask.estimatedTime} />
                </FormControl>
                <FormControl id="category" isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select defaultValue={selectedTask.category}>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="shopping">Shopping</option>
                    <option value="projects">Projects</option>
                    <option value="kids">Kids</option>
                  </Select>
                </FormControl>
                <FormControl id="free-text">
                  <FormLabel>Free Text</FormLabel>
                  <Input defaultValue={selectedTask.freeText} />
                </FormControl>
                <Button colorScheme="blue" type="submit">Update Task</Button>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Index;