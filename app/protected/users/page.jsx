import UsersClient from "./UsersClient";


export default async function users(){
    const endpoint = process.env.BACKEND_URL + "/selectUsers";
    const response = await fetch(endpoint)
    const usersData = await response.json()

    return(<UsersClient usersData={usersData} />)
}