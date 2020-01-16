import React from 'react'
// import logo from '../../../assets/images/logo.svg'

export class DetailPage extends React.PureComponent<{
  title: string
}> {
  // 数据预取方法  静态 异步 方法
  public static async getInitialProps(params: object) {
    console.log(params)
    return {
      title: 'hello world'
    }
  }

  public render() {
    return <div className='App'>
      <header className='App-header'>
        {/* <img src={logo} className='App-logo' alt='logo' /> */}
        <span>test: {this.props.title}</span>
      </header>
    </div>
  }
}
