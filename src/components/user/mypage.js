import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import MainHeader from '../main/main-header'
import MyInfo from './myinfo'
import MyMenu from './mymenu.js'
import Share from './share'
import { Link } from 'react-router-dom'
import leftArrow from '../main/img/left-arrow.png'
import blankPic from './img2/blank.png'

class Mypage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isResultModalOpen: false,
      userInfo: {
        username: '',
        email: '',
        password: '',
        userImg: blankPic,
        save: [
          /* 실험용 더미
          {
            createdAt: '2021-01-01',
            foodImg: "https://i.imgur.com/Ud0mryq.jpg",
            foodName: '테스트음식',
            id: 99,
            link: "https://www.youtube.com/watch?v=TkElH6dFhW8",
            updatedAt: '2021-01-03',
            userId: 9
          }*/
        ]
      }
    };
    this.getUserInfo = this.getUserInfo.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.deleteRecipeLog = this.deleteRecipeLog.bind(this);
  }

  /* 만약 로컬스토리지와 스테이트의 유저인포가 다를 때 유저정보 자동갱신 */
  componentDidMount() {
    this.getUserInfo();
    this.props.LoginChecker();
    this.props.maintainToken();
  }

  /* 레시피 로그 삭제 함수 */
  async deleteRecipeLog(key){
     //x클릭한 정보 db에서 삭제
    await axios.delete('https://onemeal.site/users/deleterecipe',{id:key},{withCredentials: true})
    console.log(key)
   
    //삭제된 db에서 정보 제 업로딩
    fetch('https://onemeal.site/users/userinfo', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
      })
      .then(res => res.json())
      .then(res => {
        localStorage.setItem('recipelog', JSON.stringify(res.log));
        let getlog = JSON.parse(localStorage.getItem('recipelog'))
        this.setState({
          userInfo: {
            save: getlog
          }
        })
        this.props.history.push("/mypage");
        alert("삭제되었습니다.")
      })
      .catch(err => {
        console.log(err);
      })
    }

  /* 유저정보 불러오는 함수 */
  getUserInfo() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.props.accessToken) {
      let getInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.setState({
        userInfo: {
          username: getInfo.username,
          email: getInfo.email,
          userImg: getInfo.userImg
        }
      })
      console.log('스토리지에 저장된 깃헙인포를 가져왔어요');
      this.props.history.push("/mypage");
    }
    else {
      fetch('https://onemeal.site/users/userinfo', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
      })
      .then(res => res.json())
      .then(res => {
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        localStorage.setItem('recipelog', JSON.stringify(res.log));
        let getInfo = JSON.parse(localStorage.getItem('userInfo'))
        let getlog = JSON.parse(localStorage.getItem('recipelog'))
        console.log(getlog)
        this.setState({
          userInfo: {
            username: getInfo.username,
            email: getInfo.email,
            password: getInfo.password,
            userImg: `https://onemeal.site/userImg/${getInfo.userImg}`,
            save: getlog
          }
        })
        console.log('유저정보랑 레시피를 새로 받아왔어요')
        this.props.history.push("/mypage");
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

    /* 로그아읏 함수 */
    handleLogout() {
      // 깃헙 로그아웃
      if (this.props.accessToken) {
        this.props.githubLogout();
        alert('성공적으로 로그아웃 되었습니다!')
        this.props.history.push("/main");
      }
      // 일반 로그아웃
      else {
        axios({
          method: 'POST',
          url: 'https://onemeal.site/users/logout',
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
        .then(() => {
          this.props.handleLogin();
          localStorage.clear();
        })
        .then(() => {
          alert('성공적으로 로그아웃 되었습니다!')
          this.props.history.push("/main");
        })
      }
    }

    render() {
      const { isResultModalOpen, userInfo } = this.state;
      const { accessToken } = this.props;
      return (
        <div className='my-wrap'>
          <MainHeader isLogin={this.props.isLogin} username={userInfo.username} loginModalHandler={this.loginModalHandler} />
          <div className='my-container'>
            <MyInfo userInfo={userInfo} getUserInfo={this.getUserInfo} accessToken={accessToken} />
            <MyMenu save={userInfo.save} deleteRecipeLog={this.deleteRecipeLog} accessToken={accessToken} />
          </div>
          <Link to="/main" className='my-pieaceOfMainpage'><img src={leftArrow} alt='' className='l-arrow' /></Link>
          <button className='my-logout-button' onClick={this.handleLogout}>로그아웃</button>
          { isResultModalOpen ? <Share /> : null}
        </div>
      );
    }
  }



  export default withRouter(Mypage);
