import axios from "axios";
import { useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useState } from 'react'
import { useEffect } from 'react'
import { useStateContext } from "../contexts/contextProvider";

export default function users(){

	const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  //    useEffect(()=> {
  //       getUsers();
  //   }, [])

	 // const getUsers = () => {
  //       setLoading(true)
  //       axiosClient.get('/users')
  //         .then(({ data }) => {
  //         	console.log(data)
  //           setLoading(false)
  //           setUsers(data)
  //         })
  //         .catch(err => {
  //         	console.log(err)
  //           //setLoading(false)
  //         })
  //     }

   useEffect(() => {
    const fetchCards = async () => {
      try {
        const { data } = await axios.get('/latBusiness');
        setCards(data.data);
      } catch (err) {
        console.error('Error fetching cards:', err);
      }
    };

    fetchCards();
  }, []);

      const onDeleteClick = user => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
          return
        }
        axiosClient.get(`/delete/${user.id}`)
          .then(() => {
            getUsers()
          })
      }

	return (
	<div>
        <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
          <h1>Users</h1>
          <Link className="btn-add" to="/users/new">Add new</Link>
        </div>
        <div className="card animated fadeInDown">
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
            </thead>
            {loading &&
              <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
              </tbody>
            }
            {!loading &&
              <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                    &nbsp;
                    <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                  </td>
                </tr>
              ))}
              </tbody>
            }
          </table>
        </div>
      </div>
	)
};