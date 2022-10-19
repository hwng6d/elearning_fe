import { Button, Input, Modal, Space, InputNumber, Select, Tooltip, Form, Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { ToTopOutlined, UploadOutlined } from '@ant-design/icons'
import styles from '../../styles/components/forms/ModalEditCourse.module.scss';

const ModalAddLesson = ({
  course,
  modalEditCourse,
  closeEditCourseHandler,
  setModalEditCourse,
  courseBeingEdited,  // name, price, category, paid
  setCourseBeingEdited,
  editCourseHandler,
}) => {
  const [form] = Form.useForm();

  const inputChangeHandler = (e) => {
    setCourseBeingEdited({ ...courseBeingEdited, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    console.log('useEffect: ', courseBeingEdited);
  }, [])

  return (
    <Modal
      className={styles.container}
      width={720}
      title={<b>Chỉnh sửa</b>}
      open={modalEditCourse.opened}
      centered={true}
      maskClosable={false}
      onCancel={closeEditCourseHandler}
      footer={(
        <Button
          type='primary'
          onClick={editCourseHandler}
        >
          Hoàn tất
        </Button>
      )}
    >
      <Form
        form={form}
        className={styles.form}
        layout='vertical'
        initialValues={course}
      >
        {/* area which: general */}
        {
          modalEditCourse?.which === 'general' && (
            <div>
              <Form.Item label='Tên khóa học' className={styles.form_item}>
                <Input
                  name='name'
                  allowClear={true}
                  value={courseBeingEdited.name}
                  onChange={(e) => inputChangeHandler(e)}
                />
              </Form.Item>
              <Form.Item label='Tag' className={styles.form_item}>
                <Input
                  name='category'
                  allowClear={true}
                  value={courseBeingEdited.category}
                  onChange={(e) => inputChangeHandler(e)}
                />
              </Form.Item>
              <Form.Item label='Loại khóa học' name='paid' className={styles.form_item}>
                <Select
                  value={courseBeingEdited.paid}
                  onChange={(value) =>
                    setCourseBeingEdited({
                      ...courseBeingEdited,
                      paid: value,
                      price: !value ? 0 : course.price
                    })
                  }
                >
                  <Select.Option value={true}>Có phí</Select.Option>
                  <Select.Option value={false}>Miễn phí</Select.Option>
                </Select>
              </Form.Item>
              {courseBeingEdited.paid && (
                <Form.Item label='Giá' name='price' className={styles.form_item}>
                  <InputNumber
                    style={{ width: '100%' }}
                    value={courseBeingEdited.price}
                    min={0}
                    max={99.99}
                    onChange={(value) => setCourseBeingEdited({ ...courseBeingEdited, price: value })}
                  />
                </Form.Item>
              )}
              <Form.Item label='Xuất bản khóa học này ?' className={styles.form_item}>
                {
                  course.lessons.length < 5
                  ? <p><i>(Khóa học này chưa đủ điều điện để xuất bản)</i></p>
                  : <Switch
                      checked={courseBeingEdited.published}
                      onChange={(value) => setCourseBeingEdited({ ...courseBeingEdited, published: value })}
                    />
                }
              </Form.Item>
            </div>
          )
        }

        {/* area which: description */}
        {
          modalEditCourse?.which === 'description' && (
            <div>
              <Form.Item label='Mô tả khóa học' className={styles.form_item}>
                <Input.TextArea
                  name='description'
                  allowClear={true}
                  value={courseBeingEdited.description}
                  style={{ height: '600px' }}
                  onChange={(e) => inputChangeHandler(e)}
                />
              </Form.Item>
            </div>
          )
        }
      </Form>
    </Modal>
  )
}

export default React.memo(ModalAddLesson);