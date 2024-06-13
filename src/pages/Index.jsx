import { Box, Flex, Heading, VStack, Text, IconButton, useColorMode, Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel, Input, Select, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Checkbox, useBreakpointValue } from "@chakra-ui/react";
import { FaSun, FaMoon, FaTasks, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useState } from "react";

const Index = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterImportance, setFilterImportance] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [taskCompletion, setTaskCompletion] = useState({});
  const [taskNotes, setTaskNotes] = useState({});
  const [taskNextDate, setTaskNextDate] = useState({});

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
      freeText: form["free-text"].value,
    };
    setTasks([...tasks, newTask]);
    setTaskCompletion({ ...taskCompletion, [newTask.id]: false });
    setTaskNotes({ ...taskNotes, [newTask.id]: "" });
    setTaskNextDate({ ...taskNextDate, [newTask.id]: "" });
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
      freeText: form["free-text"].value,
    };
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setTaskCompletion({ ...taskCompletion, [updatedTask.id]: form["task-completion"].checked });
    setTaskNotes({ ...taskNotes, [updatedTask.id]: form["task-notes"].value });
    setTaskNextDate({ ...taskNextDate, [updatedTask.id]: form["task-next-date"].value });
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
      <Flex as="header" width="100%" padding={useBreakpointValue({ base: "2", md: "4" })} boxShadow="md" justifyContent="space-between" alignItems="center">
        <Heading as="h1" size={useBreakpointValue({ base: "md", md: "lg" })}>This is how my brain works</Heading>
        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
        />
      </Flex>

      <Flex flex="1">
        {/* Sidebar */}
        <Box as="nav" width={useBreakpointValue({ base: "100%", md: "250px" })} padding={useBreakpointValue({ base: "2", md: "4" })} boxShadow="md">
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
        <Box as="main" flex="1" padding={useBreakpointValue({ base: "2", md: "4" })}>
          <Flex mb="4" justifyContent="space-between" flexDirection={useBreakpointValue({ base: "column", md: "row" })}>
            <FormControl width={useBreakpointValue({ base: "100%", md: "30%" })}>
              <FormLabel>Filter by Importance</FormLabel>
              <Select placeholder="All" onChange={(e) => setFilterImportance(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </FormControl>
            <FormControl width={useBreakpointValue({ base: "100%", md: "30%" })}>
              <FormLabel>Filter by Day</FormLabel>
              <Input type="date" onChange={(e) => setFilterDay(e.target.value)} />
            </FormControl>
            <FormControl width={useBreakpointValue({ base: "100%", md: "30%" })}>
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
              <Tab>DONE tasks</Tab>
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
                      <Text>Completion Status: {taskCompletion[task.id] ? "Done" : "Pending"}</Text>
                      <Text>Notes: {taskNotes[task.id]}</Text>
                      <Text>Next Check Date: {taskNextDate[task.id]}</Text>
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
                      <Text>Completion Status: {taskCompletion[task.id] ? "Done" : "Pending"}</Text>
                      <Text>Notes: {taskNotes[task.id]}</Text>
                      <Text>Next Check Date: {taskNextDate[task.id]}</Text>
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
                    <FormLabel>Estimated Time to Complete (in minutes)</FormLabel>
                    <Select placeholder="Select estimated time">
                      {[...Array(24 * 12)].map((_, i) => (
                        <option key={i} value={(i + 1) * 5}>{(i + 1) * 5} minutes</option>
                      ))}
                    </Select>
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
                  <FormControl id="task-completion">
                    <FormLabel>Mark as Done</FormLabel>
                    <Checkbox />
                  </FormControl>
                  <FormControl id="task-notes">
                    <FormLabel>Notes</FormLabel>
                    <Input placeholder="Enter any additional notes" />
                  </FormControl>
                  <FormControl id="task-next-date">
                    <FormLabel>Next Check Date</FormLabel>
                    <Input type="datetime-local" />
                  </FormControl>
                  <Button colorScheme="blue" type="submit">Create Task</Button>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack align="start" spacing="4">
                  {tasks.filter(task => taskCompletion[task.id]).map((task, index) => (
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
                      <Text>Completion Status: Done</Text>
                      <Text>Notes: {taskNotes[task.id]}</Text>
                      <Text>Next Check Date: {taskNextDate[task.id]}</Text>
                      <Flex mt="2">
                        <IconButton aria-label="Task done" icon={<FaTimes />} />
                      </Flex>
                    </Box>
                  ))}
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
                  <FormLabel>Estimated Time to Complete (in minutes)</FormLabel>
                  <Select defaultValue={selectedTask.estimatedTime}>
                    {[...Array(24 * 12)].map((_, i) => (
                      <option key={i} value={(i + 1) * 5}>{(i + 1) * 5} minutes</option>
                    ))}
                  </Select>
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
                <FormControl id="task-completion">
                  <FormLabel>Mark as Done</FormLabel>
                  <Checkbox defaultChecked={taskCompletion[selectedTask.id]} />
                </FormControl>
                <FormControl id="task-notes">
                  <FormLabel>Notes</FormLabel>
                  <Input defaultValue={taskNotes[selectedTask.id]} />
                </FormControl>
                <FormControl id="task-next-date">
                  <FormLabel>Next Check Date</FormLabel>
                  <Input type="datetime-local" defaultValue={taskNextDate[selectedTask.id]} />
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