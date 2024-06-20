import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Modal, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Icon, Input, CheckBox } from 'react-native-elements';
import IconFA from 'react-native-vector-icons/FontAwesome';

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>This is how my brain works</Text>
        <Switch
          value={isDarkMode}
          onValueChange={() => setIsDarkMode(!isDarkMode)}
        />
      </View>

      <View style={styles.content}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Task Lists</Text>
          <View style={styles.sidebarItem}>
            <IconFA name="tasks" size={20} />
            <Text style={styles.sidebarItemText}>Personal</Text>
          </View>
          <View style={styles.sidebarItem}>
            <IconFA name="tasks" size={20} />
            <Text style={styles.sidebarItemText}>Work</Text>
          </View>
          <View style={styles.sidebarItem}>
            <IconFA name="tasks" size={20} />
            <Text style={styles.sidebarItemText}>Shopping</Text>
          </View>
          <View style={styles.sidebarItem}>
            <IconFA name="tasks" size={20} />
            <Text style={styles.sidebarItemText}>Projects</Text>
          </View>
          <View style={styles.sidebarItem}>
            <IconFA name="tasks" size={20} />
            <Text style={styles.sidebarItemText}>Kids</Text>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <View style={styles.filters}>
            <Input
              placeholder="Filter by Importance"
              onChangeText={(value) => setFilterImportance(value)}
            />
            <Input
              placeholder="Filter by Day"
              onChangeText={(value) => setFilterDay(value)}
            />
            <Input
              placeholder="Filter by Category"
              onChangeText={(value) => setFilterCategory(value)}
            />
          </View>
          <ScrollView>
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
              <View key={index} style={styles.taskCard}>
                <Text style={styles.taskTitle}>{task.name}</Text>
                <Text>Importance: {task.importance}</Text>
                <Text>Scheduled Time: {new Date(task.scheduledTime).toLocaleString()}</Text>
                <Text>Estimated Time: {task.estimatedTime} hours</Text>
                <Text>Category: {task.category}</Text>
                <Text>Free Text: {task.freeText}</Text>
                <Text>Completion Status: {taskCompletion[task.id] ? "Done" : "Pending"}</Text>
                <Text>Notes: {taskNotes[task.id]}</Text>
                <Text>Next Check Date: {taskNextDate[task.id]}</Text>
                <View style={styles.taskActions}>
                  <Icon
                    name="edit"
                    type="font-awesome"
                    onPress={() => openTaskModal(task)}
                  />
                  <Icon
                    name="trash"
                    type="font-awesome"
                    onPress={() => handleDeleteTask(task.id)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Task Modal */}
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          {selectedTask && (
            <View>
              <Input
                placeholder="Task Name"
                defaultValue={selectedTask.name}
              />
              <Input
                placeholder="Importance"
                defaultValue={selectedTask.importance}
              />
              <Input
                placeholder="Scheduled Time"
                defaultValue={selectedTask.scheduledTime}
              />
              <Input
                placeholder="Estimated Time to Complete (in minutes)"
                defaultValue={selectedTask.estimatedTime}
              />
              <Input
                placeholder="Category"
                defaultValue={selectedTask.category}
              />
              <Input
                placeholder="Free Text"
                defaultValue={selectedTask.freeText}
              />
              <CheckBox
                title="Mark as Done"
                checked={taskCompletion[selectedTask.id]}
              />
              <Input
                placeholder="Notes"
                defaultValue={taskNotes[selectedTask.id]}
              />
              <Input
                placeholder="Next Check Date"
                defaultValue={taskNextDate[selectedTask.id]}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 250,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  sidebarTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sidebarItemText: {
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  taskCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  taskTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalContent: {
    padding: 16,
  },
});

export default Index;