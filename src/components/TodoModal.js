import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { addTodo, updateTodo } from '../slices/todoSlice';
import styles from '../styles/modules/modal.module.scss';
import Button from './Button';

const dropIn = {
  hidden: {
    opacity: 0,
    transform: 'scale(0.9)',
  },
  visible: {
    transform: 'scale(1)',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: 'scale(0.9)',
    opacity: 0,
  },
};

function TodoModal({ type, modalOpen, setModalOpen, todo }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [descrip, setDescription] = useState('');
  const [status, setStatus] = useState('incomplete');
  const [strdate, setStartDate] = useState('incomplete');
  const [enddate, setEndDate] = useState('incomplete');

  useEffect(() => {
    if (type === 'update' && todo) {
      setTitle(todo.title);
      setDescription(todo.descrip);
      setStatus(todo.status);
      setStartDate(todo.strdate);
      setEndDate(todo.enddate);
    } else {
      setTitle('');
      setDescription('');
      setStatus('incomplete');
      setStartDate('');
      setEndDate('');
    }
  }, [type, todo, modalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title === '') {
      toast.error('Please enter a title');
      return;
    }
    if (title && descrip && status && strdate && enddate) {
      if (type === 'add') {
        if (strdate <= enddate) {
          toast.success('Task added successfully');
        } else {
          toast.error('Task added unsuccessfully');
          return;
        }
        dispatch(
          addTodo({
            id: uuid(),
            title,
            descrip,
            status,
            strdate,
            enddate,
            // time: new Date().toLocaleString(),
          })
        );
      }
      if (type === 'update') {
        if (
          todo.title !== title ||
          todo.descrip !== descrip ||
          todo.status !== status ||
          todo.strdate !== strdate ||
          todo.enddate !== enddate
        ) {
          if (strdate <= enddate) {
            toast.success('Task Updated successfully');
          } else if (enddate < strdate) {
            toast.error('Cant Update');
            return;
          }
          dispatch(
            updateTodo({ ...todo, title, descrip, status, enddate, strdate })
          );
        } else {
          toast.error('No changes made');
          return;
        }
      }
      setModalOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onKeyDown={() => setModalOpen(false)}
              onClick={() => setModalOpen(false)}
              role="button"
              tabIndex={0}
              // animation
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>

            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
              <h1 className={styles.formTitle}>
                {type === 'add' ? 'Add' : 'Update'} TODO
              </h1>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label htmlFor="type">
                Description
                <input
                  type="text"
                  id="description"
                  value={descrip}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <label htmlFor="type">
                Status
                <select
                  id="type"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="complete">Completed</option>
                </select>
                <label htmlFor="type">
                  Start Date
                  <input
                    type="date"
                    id="type"
                    value={strdate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                <label htmlFor="type">
                  End Date
                  <input
                    type="date"
                    id="type"
                    value={enddate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>
              </label>
              <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary">
                  {type === 'add' ? 'Add Task' : 'Update Task'}
                </Button>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TodoModal;
