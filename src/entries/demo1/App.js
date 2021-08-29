import React, { Component } from 'react'
import _ from 'lodash'
import Header from '@/components/Header'
import Banner from '@/components/Banner'
import Content from '@/components/Content'
import Footer from '@/components/Footer'
import './App.less'

const AsyncModal = React.lazy(() =>
  import(/* webpackChunkName: "AsyncModal" */ '@/components/AsyncModal')
)

export default class App extends Component {
  state = {
    showModal: false,
    a: 1
  }

  componentDidMount() {
    const o = {
      a: 1,
      b: 2,
      c: 3
    }
    console.log(hhh)
    console.log(_.pick(o, ['a', 'b']))
  }

  showModal = () => {
    this.setState({
      showModal: true
    })
    this.setState({ a: 2 })
    this.setState({ a: 3 })
    Promise.resolve().then(() => {
      this.setState({ a: 33 })
    })
    setTimeout(() => {
      this.setState({ a: 4 })
    }, 0)
  }

  handleClick = () => {
    console.log(hello)
  }

  render() {
    console.log('render')
    console.log(this.state.a)

    return (
      <div className='app'>
        <Header />
        <Banner />
        <Content />
        <Footer />

        <hr />
        <br />

        <span>
          <button onClick={this.showModal}>Click me</button>
          <button onClick={this.handleClick}>Break the world</button>
        </span>
        {this.state.showModal && (
          <React.Suspense fallback={<div>loading...</div>}>
            <AsyncModal />
          </React.Suspense>
        )}
      </div>
    )
  }
}
