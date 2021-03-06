import Chef from './main-chef'
import { Component } from 'react';
import { withRouter } from 'react-router-dom'

class Openning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      talkingCount: 0,  /* 오프닝 씬 내에서 셰프가 얘기한 숫자, 해당 숫자에 따라 알맞은 대사를 chefsMessage에 할당. 5가 맥시멈 */
      chefsMessage: null,  /* 셰프 대사 */
    };
    this.talkingCountUp = this.talkingCountUp.bind(this);
    this.changeMessage = this.changeMessage.bind(this);
  }

  componentDidMount() {
    this.props.isLoginSetUp();
    localStorage.clear();
  }

  /* 화면 클릭 때 마다 talkingCount state 숫자 올려주기 */
  talkingCountUp() {
    this.changeMessage();  /* 숫자 올려주며 chefsMesaage도 같이 변환 */
    this.setState({ talkingCount: this.state.talkingCount + 1 });
    if(this.state.talkingCount === 5) {  /* 숫자가 한계치인 5에 다다르면 더이상 클릭해도 숫자를 올릴 수 없으며 오프닝이 종료됨. */
      this.setState({
        chefsMessage: null,
        isOpenning: true
      })
    }
  }

  /* talkingCount state에 할당된 번호에 따라 chefsMessage에 알맞은 대사 삽입 */
  changeMessage() {
    const {talkingCount} = this.state;
    if(talkingCount === 0) {
      this.setState({chefsMessage: `안녕하세요! 고독한 한끼입니다.`})
    }
    if(talkingCount === 1) {
      this.setState({chefsMessage: '저희 고독한 한끼는 자취생들의 소중한 한끼를 책임지는 서비스입니다.'})
    }
    if(talkingCount === 2) {
      this.setState({chefsMessage: '지금 배가 고프시다고요?!'})
    }
    if(talkingCount === 3) {
      this.setState({chefsMessage: '주방으로 뛰어가서 재료를 확인해주세요!'})
    }
    if(talkingCount === 4) {
      this.setState({chefsMessage: '그럼 황셰프에게 쉽고 간단한 레시피를 받아볼까요??'})
    }
    if(talkingCount === 5) {
      setTimeout(this.props.handleOpenningClicked, 2000);
    }
  }

  render() {
    const {chefsMessage, talkingCount} = this.state;
    const {isOpenning} = this.props;
    return(
      <div className='openning-wrap' onClick={this.talkingCountUp}>
        <Chef chefsMessage={chefsMessage} talkingCount={talkingCount} isOpenning={isOpenning}/>
      </div>
    )
  }1
  
}

export default withRouter(Openning)
