import React, { useCallback, useEffect } from 'react'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator, Authenticator } from 'aws-amplify-react';
import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'
import awsExports from './aws-exports'

Auth.configure(awsExports)
API.configure(awsExports)

function App() {
  const listTodos = useCallback(
    async () => {
      const allTodos = await API.graphql(graphqlOperation(queries.listTodos))

      console.log({ allTodos })

      // const oneTodo = API.graphql(graphqlOperation(queries.getTodo, { id: "" }))

      // console.log({ oneTodo })
    },
    [],
  )

  const createTodo = useCallback(
    () => {
      Auth.currentAuthenticatedUser({
        bypassCache: false
      }).then(async (user) => {
        console.log({ user })

        const todo = { name: user['username'], description: "new todo" }
        const newTodo = await API.graphql(graphqlOperation(mutations.createTodo, { input: todo }))

        console.log({ newTodo })
      }).catch((error) => console.log({ error }))
    },
    [],
  )

  useEffect(() => {
    listTodos()
    createTodo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

// export default App
export default withAuthenticator(App, { includeGreetings: true });
