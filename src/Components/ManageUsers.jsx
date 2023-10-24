import React, { useContext } from 'react';
import { JobContext } from './Context/JobProvider';

const ManageUsers = () => {
    const { isAdmin, users, deleteUserFromDataBase , makeAdmin, makeEditor } = useContext(JobContext)
    // console.log(isAdmin, users);
    return (
        <div className='py-20 backgruond-color'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:px-10 justify-center">
                {
                    users?.map(user => (
                        <div key={user._id} className="card w-80 mx-auto glass">
                            <figure >
                                <img className='p-3 w-[150px] h-[150px] rounded-full' src={user.image ? user.image : "https://static.vecteezy.com/system/resources/previews/011/490/381/non_2x/happy-smiling-young-man-avatar-3d-portrait-of-a-man-cartoon-character-people-illustration-isolated-on-white-background-vector.jpg"} alt="car!" />
                            </figure>
                            <div className="card-body p-4">
                                <h2 className="card-title"> Name : {user.name} </h2>
                                <p>Email : {user.email}</p>
                                <p>Current Role : {user.role}</p>
                                <div className="card-actions justify-between py-4">
                                    <button disabled={!isAdmin} onClick={()=> deleteUserFromDataBase(user)} className="btn btn-xs btn-secondary">Delete</button>
                                    <button disabled={user.role === "Admin"} onClick={()=> makeAdmin(user)} className="btn btn-xs btn-primary">Make Admin</button>
                                    <button disabled={user.role === "Editor" || user.role === "Admin"} onClick={()=> makeEditor(user)} className="btn btn-xs btn-accent">Make Editor</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    );
};

export default ManageUsers;