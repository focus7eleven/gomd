/*
 * 老师批改，图片涂鸦
 */
import React from 'react';
import {Button} from 'antd';
import classNames  from 'classnames';

import styles from './CommentCanvas.scss';
import {XhlIconButton} from '../button/XhlIconButton';

import duiMiddleImgSrc from 'images/comment_homework/dui-middle.png';
import duiImgSrc from 'images/comment_homework/dui.png';
import banduiMiddleImgSrc from 'images/comment_homework/bandui-middle.png';
import banduiImgSrc from 'images/comment_homework/bandui.png';
import cuoMiddleImgSrc from 'images/comment_homework/cuo-middle.png';
import cuoImgSrc from 'images/comment_homework/cuo.png';

const DEFAULT_CANVAS_WIDTH = 400;
const DEFAULT_CANVAS_HEIGHT = 400;

export const CommentCanvas = React.createClass({
    _canvasContext:{},
    _canvas:{},
    _contextData:{mousePressed:false,lastX:0,lastY:0},
    propTypes: {
        imageSrc:React.PropTypes.string.isRequired,
        width:React.PropTypes.number,
        className:React.PropTypes.string,
        questionType:React.PropTypes.string.isRequired,

        commentDataChanged:React.PropTypes.func.isRequired,
        saveCommentData:React.PropTypes.func.isRequired,
        clearCommentData:React.PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            width:DEFAULT_CANVAS_WIDTH,
        }
    },
    getInitialState() {
        return {
            currentMode:"draw", //draw dui bandui cuo
            dataChanged:false,
        }
    },
    componentWillReceiveProps(nextProps) {
        const {imageSrc, width} = nextProps;
        this.initCanvas(imageSrc, width);
        this._contextData = {mousePressed:false,lastX:0,lastY:0};
    },
    componentDidMount() {
        const {imageSrc, width} = this.props;
        this.initCanvas(imageSrc, width);
    },
    render() {
        const {imageSrc, width, className} = this.props;
        const { currentMode, dataChanged } = this.state;

        return (
          <div className={classNames(className,styles.container)}>
              <canvas className={styles.canvas}
                      width={DEFAULT_CANVAS_WIDTH}
                      height={DEFAULT_CANVAS_HEIGHT}
                      ref="imgCanvas"
                      onMouseDown={(e)=>this.mouseDown(e)}
                      onMouseMove={(e)=>this.mouseMove(e)}
                      onMouseUp={(e)=>this.mouseUp(e)}
                      onMouseLeave={(e)=>this.mouseLeave(e)}
              >
                  <div>你的浏览器不支持在线批改</div>
                  <image src={imageSrc} width={width}></image>
              </canvas>
              <div className={styles.buttonGroupVertical}>
                  <Button className={styles.button} icon="edit"
                          type={currentMode=='draw'?'primary':null}
                          onClick={()=>this.changeDrawType("draw")} />
                  <XhlIconButton className={styles.button} icon="dui-small"
                                 type={currentMode=='dui'?'primary':null}
                                 onClick={()=>this.changeDrawType("dui")} />
                  <XhlIconButton className={styles.button} icon="bandui-small"
                                 type={currentMode=='bandui'?'primary':null}
                                 onClick={()=>this.changeDrawType("bandui")} />
                  <XhlIconButton className={styles.button} icon="cuo-small"
                                 type={currentMode=='cuo'?'primary':null}
                                 onClick={()=>this.changeDrawType("cuo")} />
                  <XhlIconButton className={styles.button} icon="rotate-left"
                                 onClick={()=>{this.rotateImage("left")}} />
                  <XhlIconButton className={styles.button} icon="rotate-right"
                                 onClick={()=>{this.rotateImage("right")}} />
                  <Button className={styles.button} icon="save"
                          onClick={()=>{this.saveCanvasData()}}
                          disabled={dataChanged?"":"disabled"} />
                  <Button className={styles.button} icon="delete"
                          onClick={()=>{this.clearCanvasData()}}
                          disabled={dataChanged?"":"disabled"}/>
              </div>
          </div>
        );
    },
    initCanvas(imageSrc, width) {

        this._canvas = this.refs.imgCanvas;

        this._canvasContext = this._canvas.getContext("2d");

        let image = new Image();
        image.crossOrigin="anonymous";
        image.onload = () => {
            let imageWidth = image.width > width ? width : image.width;
            let imageHeight = image.height * imageWidth / image.width;

            this._canvas.width = imageWidth;
            this._canvas.height = imageHeight;

            this._canvasContext.clearRect(0, 0, imageWidth, imageHeight);
            this._canvasContext.drawImage(image, 0, 0, imageWidth, imageHeight);
        };
        image.src = imageSrc;
    },
    mouseDown(e) {
        this._contextData.mousePressed = true;
        if( this.state.currentMode == "draw" ) {
            this.draw(this.getOffsetPosition(e), false);
        } else {
            this.draw(this.getOffsetPosition(e), true);
        }
    },
    mouseMove(e){
        if(this._contextData.mousePressed) {
            this.draw(this.getOffsetPosition(e), this.state.currentMode == "draw");
        }
    },
    mouseUp(e){
        if( this._contextData.mousePressed ) {
            this.drawDataChanged();
        }
        this._contextData.mousePressed = false;
    },
    mouseLeave(e){
        if( this._contextData.mousePressed ) {
            this.drawDataChanged();
        }
        this._contextData.mousePressed = false;
    },
    changeDrawType(mode) {
        this.setState({
            currentMode:mode
        });
    },
    draw(position, isDown) {
        if( isDown ) {
            if( this.state.currentMode == "draw" ) {
                this._canvasContext.beginPath();
                this._canvasContext.strokeStyle = "red";
                this._canvasContext.lineJoin = "round";
                this._canvasContext.lineWidth = 3;
                this._canvasContext.moveTo(this._contextData.lastX, this._contextData.lastY);
                this._canvasContext.lineTo(position.x,position.y);
                this._canvasContext.closePath();
                this._canvasContext.stroke();
                //this.drawDataChanged();
            } else {
                let image = new Image();
                image.onload = () => {
                    let drawX = position.x > image.width/2 ? position.x - image.width/2 : 0;
                    let dwarY = position.y > image.height/2 ? position.y - image.height/2 : 0;
                    this._canvasContext.drawImage(image, drawX, dwarY);
                    this.drawDataChanged();
                };
                image.src= this.getTagImageSrc();
            }
        }
        this._contextData.lastX = position.x;
        this._contextData.lastY = position.y;

    },
    getTagImageSrc() {
        const { currentMode } = this.state;
        const { questionType } = this.props;

        if( currentMode == "dui" ) {
            if( questionType == "04" ) {
                return duiMiddleImgSrc;
            } else {
                return duiImgSrc;
            }
        } else if( currentMode == "bandui" ) {
            if( questionType == "04" ) {
                return banduiMiddleImgSrc;
            } else {
                return banduiImgSrc;
            }
        } else if( currentMode == "cuo" ) {
            if( questionType == "04" ) {
                return cuoMiddleImgSrc;
            } else {
                return cuoImgSrc;
            }
        }
    },
    getOffsetPosition(e) {
        let canvasX = e.target.getBoundingClientRect().left;
        let canvasY = e.target.getBoundingClientRect().top;

        return {x: e.clientX - canvasX, y:e.clientY - canvasY};
    },
    rotateImage:function(type) {
        let imgSaveData = this._canvas.toDataURL("image/png");
        let image = new Image();
        image.crossOrigin="anonymous";
        image.onload = () => {
            let tempWidth = this._canvas.width;
            let imageWidth = image.width > this.props.width ? this.props.width : image.width;
            let imageHeight = image.height * imageWidth / image.width;

            this._canvas.width = imageHeight;
            this._canvas.height = imageWidth;
            let x = this._canvas.width/2;
            let y = this._canvas.height/2;

            this._canvasContext.clearRect(0,0, this._canvas.width, this._canvas.height);//先清掉画布上的内容
            this._canvasContext.save();
            this._canvasContext.translate(x,y);
            if( type == "left" ) {
                this._canvasContext.rotate(270*Math.PI/180);
            } else {
                this._canvasContext.rotate(90*Math.PI/180);
            }
            this._canvasContext.drawImage(image, -y, -x, imageWidth, imageHeight);
            this._canvasContext.restore();
            //this._canvasContext.save();
            this.drawDataChanged();

        }
        image.src = imgSaveData;
    },
    drawDataChanged() {
        let imgSaveData = this._canvas.toDataURL("image/png");
        this.props.commentDataChanged(imgSaveData);
        this.setState({
            dataChanged:true,
        });
    },
    saveCanvasData() {
        this.props.saveCommentData();
        this.setState({
            dataChanged:false,
        });

    },
    clearCanvasData() {
        this.props.clearCommentData()
        this.setState({
            dataChanged:false,
        });
    }
})
