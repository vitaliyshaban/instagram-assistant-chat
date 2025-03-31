
interface User {
    id: number
    name: string
    email: string
}
// async function getAll() {
//     const response = await fetch('https://jsonplaceholder.typicode.com/users', { cache: "no-cache" })
//     return await response.json()
// } 

const About = async () => {
    // const data: User[] = await getAll()

    return (
        <>
            <section className="p-5">
                <h1 className="text-left text-5xl mb-5">About is</h1>
                <ul>
                    {/* {data.map((user) => {
                    return (
                        <li key={user.id}>{user.name} [{user.id}] - {user.email}</li>
                    )
                })} */}
                </ul>
            </section>
        </>
    )
}

export default About