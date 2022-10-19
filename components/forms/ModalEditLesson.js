import { useState } from 'react';
import { Button, Modal, Input, Space, Tooltip, Upload, Progress, Switch, message } from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Plyr from 'plyr-react';
import styles from '../../styles/components/forms/modalEditLesson.module.scss'

const ModalEditLesson = ({
	course,
	modalEditLesson,  // open, which
	setModalEditLesson,
	lessonBeingEdited,  // title, content, video_link
	setLessonBeingEdited,
	// closeEditLessonHandler,
	editLessonHandler,
}) => {
	const [validateMessage, setValidateMessage] = useState('');
	const [videosUpload, setVideosUpload] = useState([]);
	const [progressUploadVideo, setProgressUploadVideo] = useState(0);

	const videoChangeHandler = async ({ file, fileList, event }) => {
		setVideosUpload(fileList);
		setValidateMessage(<div></div>);
	}

	const videoRemoveHandler = () => {
		setProgressUploadVideo(0);
		setVideosUpload([])
	}

	const closeEditLessonHandler = async () => {
		setModalEditLesson({ ...modalEditLesson, opened: false });
		setVideosUpload([]);
		setProgressUploadVideo(0);
	}

	const uploadVideoHandler = async () => {
		try {
			setValidateMessage(<p style={{ color: '#4e96ff', padding: '4px 0px' }}>Đang tải lên video...</p>);
			const file = videosUpload[0]?.originFileObj;
			if (!file) {
				setValidateMessage(<p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng chọn video</p>);
				return;
			}

			// set video file for uploading to s3
			const videoData = new FormData();
			videoData.append("video", file);

			// send request to BE to upload video
			const { data: videoResponse } = await axios.post(
				`/api/course/upload-video/${course.instructor._id}`,
				videoData,
				{
					onUploadProgress: (e) => {
						console.log('e onUploadProgress: ', e);
						setProgressUploadVideo(30);
					}
				}
			);

			// delete old video if user upload new
			await axios.post(
				`/api/course/delete-video/${course.instructor._id}`,
				{ video_link: lessonBeingEdited.video_link }
			);

			setProgressUploadVideo(100);
			setLessonBeingEdited({ ...lessonBeingEdited, video_link: videoResponse.data });
			setValidateMessage(<div></div>);
		}
		catch (error) {
			message.error(`Xảy ra lỗi khi tải lên video, vui lòng thử lại\nChi tiết: ${error.message}`)
		}
	}

	return (
		<Modal
			className={styles.container}
			width={640}
			title={<p>Chỉnh sửa bài học <b>{modalEditLesson.which}</b></p>}
			open={modalEditLesson.opened}
			centered={true}
			maskClosable={false}
			onCancel={closeEditLessonHandler}
			footer={(
				<Tooltip
					title={(!lessonBeingEdited.title || !Object.keys(lessonBeingEdited.video_link).length) ? 'Tiêu đề và video là bắt buộc' : 'Hoàn tất'}
				>
					<Button
						type='primary'
						disabled={!lessonBeingEdited.title || !Object.keys(lessonBeingEdited.video_link).length}
						onClick={editLessonHandler}>Hoàn tất</Button>
				</Tooltip>
			)}
		>
			<form
				className={styles.form}
			>
				<div
					className={styles.form_title}
				>
					<Space
						direction='vertical'
					>
						<label><b>Tiêu đề *</b></label>
						<Input
							placeholder='Nhập tiêu đề'
							value={lessonBeingEdited.title}
							onChange={(e) => {
								setLessonBeingEdited({ ...lessonBeingEdited, title: e.target.value });
								setValidateMessage(!e.target.value && <p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng nhập tiêu đề</p>)
							}}
						/>
					</Space>
				</div>
				<div
					className={styles.form_content}
					style={{ marginTop: '12px' }}
				>
					<Space
						direction='vertical'
					>
						<label><b>Tóm tắt nội dung</b></label>
						<Input.TextArea
							placeholder='Nhập tóm tắt nội dung'
							style={{ height: '128px' }}
							value={lessonBeingEdited.content}
							onChange={(e) => setLessonBeingEdited({ ...lessonBeingEdited, content: e.target.value })}
						/>
					</Space>
				</div>
				<div
					className={styles.form_freepreview}
					style={{ marginTop: '12px' }}
				>
					<Space
						direction='horizontal'
						size='middle'
					>
						<label><b>Cho phép xem trước ?</b></label>
						<Switch
							checked={lessonBeingEdited.free_preview}
							onChange={(value) => setLessonBeingEdited({ ...lessonBeingEdited, free_preview: value })}
						/>
					</Space>
				</div>
				<div
					className={styles.form_video}
					style={{ marginTop: '12px' }}
				>
					<Space
						direction='horizontal'
					>
						<label><b>Video *</b></label>
						<Upload
							className={styles.form_video_upload}
							type='file'
							accept='video/*'
							maxCount={1}
							fileList={videosUpload}
							onChange={videoChangeHandler}
							onRemove={videoRemoveHandler}
						>
							<Button icon={<UploadOutlined />} style={{ border: 'none', padding: '4px 0px' }} >Chọn video</Button>
						</Upload>
						{videosUpload.length !== 0 && <Button
							disabled={progressUploadVideo === 100}
							onClick={uploadVideoHandler}
						>Tải lên video</Button>}
						{progressUploadVideo === 100 && <CheckOutlined style={{ color: 'green', fontSize: '16px' }} />}
					</Space>
					{progressUploadVideo > 0 && progressUploadVideo !== 100 && (
						<Progress
							percent={progressUploadVideo}
						/>
					)}
					{<div style={{ width: '-webkit-fill-available', marginTop: '12px' }}>
						<Plyr
							source={{
								type: 'video',
								sources: [
									{
										src: lessonBeingEdited.video_link.Location,
										provider: 'html5'
									}
								]
							}}
						/>
					</div>}
				</div>
				{validateMessage && (
					<p style={{ color: 'red', padding: '4px 0px' }}>{validateMessage}</p>
				)}
			</form>
		</Modal>
	)
}

export default ModalEditLesson;