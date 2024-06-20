import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [filterImportance, setFilterImportance] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [taskCompletion, setTaskCompletion] = useState({});
  const [taskNotes, setTaskNotes] = useState({});
  const [taskNextDate, setTaskNextDate] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleCreateTask = (event) => {
    event.preventDefault();
    const newTask = {
      id: Date.now(),
      name: event.target["task-name"].value,
      importance: event.target["importance"].value,
      scheduledTime: event.target["scheduled-time"].value,
      estimatedTime: event.target["estimated-time"].value,
      category: event.target["category"].value,
      freeText: event.target["free-text"].value,
    };
    setTasks([...tasks, newTask]);
    setTaskCompletion({ ...taskCompletion, [newTask.id]: false });
    setTaskNotes({ ...taskNotes, [newTask.id]: "" });
    setTaskNextDate({ ...taskNextDate, [newTask.id]: "" });
    event.target.reset();
  };

  const handleUpdateTask = (event) => {
    event.preventDefault();
    const updatedTask = {
      ...selectedTask,
      name: event.target["task-name"].value,
      importance: event.target["importance"].value,
      scheduledTime: event.target["scheduled-time"].value,
      estimatedTime: event.target["estimated-time"].value,
      category: event.target["category"].value,
      freeText: event.target["free-text"].value,
    };
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setTaskCompletion({ ...taskCompletion, [updatedTask.id]: event.target["task-completion"].checked });
    setTaskNotes({ ...taskNotes, [updatedTask.id]: event.target["task-notes"].value });
    setTaskNextDate({ ...taskNextDate, [updatedTask.id]: event.target["task-next-date"].value });
    setSelectedTask(null);
    setModalVisible(false);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>This is how my brain works</Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Icon name={isDarkMode ? "sun-o" : "moon-o"} size={24} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Task Lists</Text>
          {["Personal", "Work", "Shopping", "Projects", "Kids"].map((category, index) => (
            <View key={index} style={styles.sidebarItem}>
              <Icon name="tasks" size={20} />
              <Text style={styles.sidebarItemText}>{category}</Text>
            </View>
          ))}
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <ScrollView>
            <View style={styles.filters}>
              <View style={styles.filter}>
                <Text>Filter by Importance</Text>
                <TextInput
                  placeholder="All"
                  onChangeText={setFilterImportance}
                  style={styles.input}
                />
              </View>
              <View style={styles.filter}>
                <Text>Filter by Day</Text>
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => setFilterDay(date)}
                />
              </View>
              <View style={styles.filter}>
                <Text>Filter by Category</Text>
                <TextInput
                  placeholder="All"
                  onChangeText={setFilterCategory}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.tabs}>
              <TouchableOpacity style={styles.tab}>
                <Text>Today Task</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text>All Task</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text>Create Task</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text>DONE tasks</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabContent}>
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
                  <View key={index} style={styles.task}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text>Importance: {task.importance}</Text>
                    <Text>Scheduled Time: {new Date(task.scheduledTime).toLocaleString()}</Text>
                    <Text>Estimated Time: {task.estimatedTime} hours</Text>
                    <Text>Category: {task.category}</Text>
                    <Text>Free Text: {task.freeText}</Text>
                    <Text>Completion Status: {taskCompletion[task.id] ? "Done" : "Pending"}</Text>
                    <Text>Notes: {taskNotes[task.id]}</Text>
                    <Text>Next Check Date: {taskNextDate[task.id]}</Text>
                    <View style={styles.taskActions}>
                      <TouchableOpacity onPress={() => openTaskModal(task)}>
                        <Icon name="edit" size={20} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
                        <Icon name="trash" size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Task Modal */}
      <Modal visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Task</Text>
          {selectedTask && (
            <View style={styles.form}>
              <TextInput
                placeholder="Task Name"
                defaultValue={selectedTask.name}
                style={styles.input}
              />
              <TextInput
                placeholder="Importance"
                defaultValue={selectedTask.importance}
                style={styles.input}
              />
              <DateTimePicker
                value={new Date(selectedTask.scheduledTime)}
                mode="datetime"
                display="default"
                onChange={(event, date) => setSelectedTask({ ...selectedTask, scheduledTime: date })}
              />
              <TextInput
                placeholder="Estimated Time"
                defaultValue={selectedTask.estimatedTime}
                style={styles.input}
              />
              <TextInput
                placeholder="Category"
                defaultValue={selectedTask.category}
                style={styles.input}
              />
              <TextInput
                placeholder="Free Text"
                defaultValue={selectedTask.freeText}
                style={styles.input}
              />
              <Switch
                value={taskCompletion[selectedTask.id]}
                onValueChange={(value) => setTaskCompletion({ ...taskCompletion, [selectedTask.id]: value })}
              />
              <TextInput
                placeholder="Notes"
                defaultValue={taskNotes[selectedTask.id]}
                style={styles.input}
              />
              <DateTimePicker
                value={new Date(taskNextDate[selectedTask.id])}
                mode="datetime"
                display="default"
                onChange={(event, date) => setTaskNextDate({ ...taskNextDate, [selectedTask.id]: date })}
              />
              <Button title="Update Task" onPress={handleUpdateTask} />
            </View>
          )}
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 250,
    padding: 10,
    borderRightWidth: 1,
  },
  sidebarTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sidebarItemText: {
    marginLeft: 10,
  },
  mainContent: {
    flex: 1,
    padding: 10,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filter: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    marginVertical: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 1,
  },
  tabContent: {
    flex: 1,
  },
  task: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  taskName: {
    fontWeight: 'bold',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  form: {
    marginBottom: 20,
  },
});

export default Index;