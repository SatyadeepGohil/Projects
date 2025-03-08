// Task data structure
const tasksData = [
  {
    id: 1,
    title: "Buy groceries",
    description: "Get milk, eggs, and bread",
    creationDate: "2025-03-05T10:00:00Z",
    dueDate: "2025-03-08T18:00:00Z",
    isCompleted: false,
    isImportant: true,
    isPlanned: true,
    assignedTo: "me",
    notifications: [
      {
        id: 1,
        time: "2025-03-08T16:00:00Z",
        message: "Reminder: Buy groceries in 2 hours"
      }
    ],
    repeatPattern: null // null, "daily", "weekly", "monthly"
  },
  {
    id: 2,
    title: "Finish project report",
    description: "Complete the quarterly analysis",
    creationDate: "2025-03-01T09:00:00Z",
    dueDate: "2025-03-10T17:00:00Z",
    isCompleted: false,
    isImportant: true,
    isPlanned: true,
    assignedTo: "me",
    notifications: [
      {
        id: 2,
        time: "2025-03-09T10:00:00Z",
        message: "Reminder: Report due tomorrow"
      }
    ],
    repeatPattern: null
  },
  {
    id: 3,
    title: "Call mom",
    description: "",
    creationDate: "2025-03-04T14:00:00Z",
    dueDate: "2025-03-08T19:00:00Z",
    isCompleted: false,
    isImportant: false,
    isPlanned: true,
    assignedTo: "me",
    notifications: [],
    repeatPattern: "weekly"
  },
  {
    id: 4,
    title: "Pay electricity bill",
    description: "Account #12345",
    creationDate: "2025-02-28T11:00:00Z",
    dueDate: "2025-03-07T23:59:59Z",
    isCompleted: true,
    isImportant: true,
    isPlanned: true,
    assignedTo: "me",
    notifications: [],
    repeatPattern: "monthly"
  }
];

// Task utilities
const TaskUtils = {
  // Get all tasks
  getAllTasks: () => {
    return [...tasksData];
  },
  
  // Get tasks due today
  getTodayTasks: () => {
    const today = new Date().toDateString();
    return tasksData.filter(task => 
      new Date(task.dueDate).toDateString() === today
    );
  },
  
  // Get important tasks
  getImportantTasks: () => {
    return tasksData.filter(task => task.isImportant);
  },
  
  // Get planned tasks
  getPlannedTasks: () => {
    return tasksData.filter(task => task.isPlanned);
  },
  
  // Get tasks assigned to me
  getAssignedToMeTasks: () => {
    return tasksData.filter(task => task.assignedTo === "me");
  },
  
  // Get completed tasks
  getCompletedTasks: () => {
    return tasksData.filter(task => task.isCompleted);
  },
  
  // Get incomplete tasks
  getIncompleteTasks: () => {
    return tasksData.filter(task => !task.isCompleted);
  },
  
  // Add a new task
  addTask: (task) => {
    const newTask = {
      id: tasksData.length + 1,
      creationDate: new Date().toISOString(),
      isCompleted: false,
      ...task
    };
    tasksData.push(newTask);
    return newTask;
  },
  
  // Update a task
  updateTask: (id, updates) => {
    const index = tasksData.findIndex(task => task.id === id);
    if (index !== -1) {
      tasksData[index] = { ...tasksData[index], ...updates };
      return tasksData[index];
    }
    return null;
  },
  
  // Toggle task completion status
  toggleTaskCompletion: (id) => {
    const index = tasksData.findIndex(task => task.id === id);
    if (index !== -1) {
      tasksData[index].isCompleted = !tasksData[index].isCompleted;
      return tasksData[index];
    }
    return null;
  },
  
  // Toggle task importance
  toggleTaskImportance: (id) => {
    const index = tasksData.findIndex(task => task.id === id);
    if (index !== -1) {
      tasksData[index].isImportant = !tasksData[index].isImportant;
      return tasksData[index];
    }
    return null;
  },
  
  // Delete a task
  deleteTask: (id) => {
    const index = tasksData.findIndex(task => task.id === id);
    if (index !== -1) {
      return tasksData.splice(index, 1)[0];
    }
    return null;
  },
  
  // Add notification to a task
  addNotification: (taskId, notification) => {
    const task = tasksData.find(task => task.id === taskId);
    if (task) {
      const newNotification = {
        id: task.notifications.length + 1,
        ...notification
      };
      task.notifications.push(newNotification);
      return newNotification;
    }
    return null;
  },
  
  // Delete notification from a task
  deleteNotification: (taskId, notificationId) => {
    const task = tasksData.find(task => task.id === taskId);
    if (task) {
      const index = task.notifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        return task.notifications.splice(index, 1)[0];
      }
    }
    return null;
  },

  // Add step to task
  addStep: (taskId, stepTitle) => {
    const task = tasksData.find(task => task.id === taskId);
    if (task) {
      // Initialize steps array if it doesn't exist
      if (!task.steps) {
        task.steps = [];
      }
      
      const newStep = {
        id: Date.now(),
        title: stepTitle,
        isCompleted: false
      };
      
      task.steps.push(newStep);
      return newStep;
    }
    return null;
  },
  
  // Update step
  updateStep: (taskId, stepId, updates) => {
    const task = tasksData.find(task => task.id === taskId);
    if (task && task.steps) {
      const stepIndex = task.steps.findIndex(step => step.id === stepId);
      if (stepIndex !== -1) {
        task.steps[stepIndex] = { ...task.steps[stepIndex], ...updates };
        return task.steps[stepIndex];
      }
    }
    return null;
  },
  
  // Toggle step completion
  toggleStepCompletion: (taskId, stepId) => {
    const task = tasksData.find(task => task.id === taskId);
    if (task && task.steps) {
      const step = task.steps.find(step => step.id === stepId);
      if (step) {
        step.isCompleted = !step.isCompleted;
        return step;
      }
    }
    return null;
  },
  
  // Delete step
  deleteStep: (taskId, stepId) => {
    const task = tasksData.find(task => task.id === taskId);
    if (task && task.steps) {
      const stepIndex = task.steps.findIndex(step => step.id === stepId);
      if (stepIndex !== -1) {
        return task.steps.splice(stepIndex, 1)[0];
      }
    }
    return null;
  },
  
  // Helper to get all steps for a task
  getTaskSteps: (taskId) => {
    const task = tasksData.find(task => task.id === taskId);
    return task && task.steps ? task.steps : [];
  }
};

export default TaskUtils;