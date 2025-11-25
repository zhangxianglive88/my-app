import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import AppLayout from './components/Layout/index.jsx'
import Table from './views/table/index.jsx'

function App() {
  return (
    <Router>
      <AppLayout>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/table" />} />
          <Route path="/table" component={Table} />
        </Switch>
      </AppLayout>
    </Router>
  )
}

export default App
