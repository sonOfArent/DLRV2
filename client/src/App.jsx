import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {

  const [message, setMessage] = useState("")

  useEffect(() => {
    axios.post("http://localhost:3000/api/blocks", { data: { blocks: ["stone", "cobblestone"] } })
    .then(res => {
      console.log(res)
      setMessage(res.data)
    })
  }, [])

  return (
    <div>{message && message}</div>
  )
}

export default App