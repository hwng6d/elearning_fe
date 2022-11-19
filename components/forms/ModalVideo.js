import { Modal, Button } from "antd";
import Plyr from "plyr-react";
import { useState, useEffect } from "react";

const ModalVideo = ({
  course,
  modalVideo,
  setModalVideo,
}) => {
  // states
  const [lesson, setLesson] = useState({});

  // fucntions
  const getLesson = () => {
    const _lesson = course?.lessons?.find(item => item?._id === modalVideo.lessonId);
    setLesson(_lesson);
  }

  useEffect(() => {
    getLesson();
  }, [modalVideo])

  return (
    <Modal
      width={1024}
      title={`Chương ${lesson?.section?.index} | Bài ${lesson?.index} - ${lesson?.title}`}
      open={modalVideo.opened}
      footer={null}
      onCancel={() => setModalVideo({...modalVideo, opened: false, lessonId: ''})}
    >
      <Plyr
        source={{
          type: 'video',
          sources: [
            {
              src: lesson?.video_link?.Location,
              provider: 'html5'
            }
          ]
        }}
      />
    </Modal>
  )
}

export default ModalVideo;