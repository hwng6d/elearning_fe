import { useState, useEffect } from "react";
import { Button, List, Modal, Collapse, Menu } from "antd";
import Plyr from "plyr-react";
import styles from '../../styles/components/forms/ModalFreePreview.module.scss';
import { DotChartOutlined, PlayCircleFilled } from "@ant-design/icons";

const ModalFreePreview = ({
  isFreePreview,
  setIsFreePreview,
  course
}) => {
  const freePreviewVideos = [];
  course.lessons.forEach((lesson) => {
    if (lesson.free_preview) freePreviewVideos.push(lesson);
  })

  const [video, setVideo] = useState({}); //video_link
  const [current, setCurrent] = useState(''); //_id

  useEffect(() => {
    if (!isFreePreview.opened) {
      setIsFreePreview({...isFreePreview, opened: false, which: {}});
      setCurrent('');
      setVideo({});
    }
    else {
      if (Object.keys(isFreePreview.which).length) {
        setIsFreePreview({...isFreePreview, opened: true, which: isFreePreview.which});
        setCurrent(isFreePreview.which._id);
        setVideo(isFreePreview.which.video_link);
      } else {
        setIsFreePreview({...isFreePreview, opened: true, which: freePreviewVideos[0]});
        setCurrent(freePreviewVideos[0]._id);
        setVideo(freePreviewVideos[0].video_link);
      }
    }
  }, [isFreePreview.opened])

  return (
    <Modal
      className="modal_freepreview"
      title={null}
      width={640}
      open={isFreePreview.opened}
      footer={null}
      bodyStyle={{ backgroundColor: 'black', border: '2px solid #ff5a47' }}
      onCancel={() => setIsFreePreview({...isFreePreview, opened: false, which: {}})}
    >
      <div
        className={styles.container}
      >
        <div
          className={styles.container_title}
        >
          <p><b>Xem preview</b></p>
        </div>
        <div
          className={styles.container_titlename}
        >
          <p><b>{course.name}</b></p>
        </div>
        <div
          className={styles.container_video}
        >
          <Plyr
            // autoPlay={true}
            source={{
              type: 'video',
              sources: [
                {
                  src: video?.Location,
                  provider: 'html5'
                }
              ]
            }}
          />
        </div>
        <div
          className={styles.container_listfreepreview}
        >
          <Menu
            theme="dark"
            className="menu_freepreview"
            onClick={(e) => setCurrent(e.key)}
            selectedKeys={[current]}
            items={freePreviewVideos.map(item => {
              return {
                key: item._id,
                label: item.title,
                icon: <PlayCircleFilled />,
                onClick: () => setVideo(item.video_link)
              }
            })}
          />
        </div>
      </div>
    </Modal>
  )
}

export default ModalFreePreview;