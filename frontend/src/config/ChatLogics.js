export const getSender=(loggedUSer,users)=>{

    return loggedUSer._id===users[0]._id?users[1].name:users[0].name;

}

export const getSenderFull=(loggedUSer,users)=>{
    return loggedUSer._id==users[0]._id?users[1]:users[0];
}