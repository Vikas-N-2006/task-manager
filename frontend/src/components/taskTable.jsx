const TaskTable = ({ tasks, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading tasks...</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>No tasks found</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              <td>
                <button 
                  className="btn btn-edit"
                  onClick={() => onEdit(task)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;