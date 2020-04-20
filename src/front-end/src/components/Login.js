import React, {Component} from "react";
import axios from "axios";
import Webcam from "react-webcam";
import "../App.css";
import {Spinner, Button} from "reactstrap";
import {
	withRouter,
	Link,
	BrowserRouter as Router,
	Route,
	Switch
} from "react-router-dom";
import "base64-to-image";
import {Grid} from '@material-ui/core';

class Login extends Component {
	state = {
		userFace: null
	};

	componentDidMount(Webcam) {
		this.getLogin();
	}

	setRef = webcam => {
		this.webcam = webcam;
	};

	faceDetected() {
		this.props.history.push("/Option");
		console.log("얼굴 정보 있음, 로그인 4 페이지로 넘어감");
	}

	faceNotDetected() {
		this.props.history.push("/Signup", {userFace: this.state.userFace});
		console.log("얼굴 정보 없음, 로그인 3 페이지로 넘어감");
	}

	getLogin = async () => {
		console.log("캡처되고있음");
		const dataURLtoFile = (dataurl, filename) => {
			var arr = dataurl.split(","),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);

			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}

			return new File([u8arr], filename, {type: mime});
		};

		const captureImg = setTimeout(() => {
			var base64Str = this.webcam.getScreenshot();
			var file = dataURLtoFile(base64Str, "hello.jpg");
			console.log(file);
			console.log("캡처됨");
			this.setState({
				userFace: file
			});
			this.userFace();
		}, 5000);
	};

	userFace = async () => {
		let form_data = new FormData();
		form_data.append("userFace", this.state.userFace);
		try {
			const response = await axios.post("api/v1/login/", form_data, {
				headers: {
					"content-type": "multipart/form-data"
				}
			});
			console.log(response);
			this.faceDetected();
		} catch (error) {
			console.error(error);
			this.faceNotDetected();
		}
	};

	render() {
		return (
			<div class="full-container">
				<Grid container direction="row" style={{height: '100%'}}>
					<Grid item container xs={12} sm={4} id="loginBox"  direction="column" justify="center" alignItems="center">
						<Grid item>
						<Webcam
							class="webcam"
							id="blink"
							audio={false}
							facingmode="user"
							ref={this.setRef}
							screenshotFormat="image/jpeg"
						/>
						</Grid>
						<Grid item>
						<Spinner onLoad={this.capture} color="secondary" id="spinner" /></Grid>
						<Grid item>
							<div class="alert alert-secondary border-0" style={{marginTop: '5%'}} id="text" role="alert">
							<strong>[안내]</strong> 5초 후 화면이 캡처됩니다.
						</div>
						</Grid>
					</Grid>

					<Grid item xs={12} sm={8} id="explain">
						<div
							id="carouselNext"
							class="carousel slide h-100"
							data-ride="carousel"
						>
							<ol class="carousel-indicators">
								<li
									data-target="#carouselNext"
									data-slide-to="0"
									class="active"
								></li>
								<li data-target="#carouselNext" data-slide-to="1"></li>
								<li data-target="#carouselNext" data-slide-to="2"></li>
							</ol>
							<div class="carousel-inner h-100" role="listbox">
								<div class="carousel-item  h-100 active">
									<div class="carousel-caption d-none d-md-block  ">
										<h5>Slide1_LoginExplain</h5>
										<p>
											사용자 얼굴인식으로 로그인/등록이 진행된다.감정인식분석
											하자.
										</p>
									</div>
								</div>
								<div class="carousel-item h-100">
									<div class="carousel-caption d-none d-md-block ">
										<h5>slide2_experince function</h5>
										<p>감정인식 체험기능 설명~!@#$$%</p>
									</div>
								</div>
								<div class="carousel-item  h-100">
									<div class="carousel-caption d-none d-md-block ">
										<h5>slide3_추천 function</h5>
										<p>감정인식 추천기능 설명~!@#$$%</p>
									</div>
								</div>
							</div>
							<a
								class="carousel-control-prev"
								href="#carouselNext"
								role="button"
								data-slide="prev"
							>
								<span
									class="carousel-control-prev-icon"
									aria-hidden="true"
								></span>
								<span class="sr-only">Previous</span>
							</a>
							<a
								class="carousel-control-next"
								href="#carouselNext"
								role="button"
								data-slide="next"
							>
								<span
									class="carousel-control-next-icon"
									aria-hidden="true"
								></span>
								<span class="sr-only">Next</span>
							</a>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withRouter(Login);
