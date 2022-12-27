const getCourseStatus = (course) => {
  if (course) {
    const { published, status } = course;

    if (published) {
      if (status === 'unpublic')
        return { result: 'Đang chỉnh sửa', color: 'blue' };
      else if (status === 'unaccepted')
        return { result: 'Đang chờ phê duyệt', color: '#cccc24' };
      else if (status === 'rejected')
        return { result: 'Đã bị từ chối phê duyệt', color: 'orange' };
      else if (status === 'public')
        return { result: 'Đang được xuất bản', color: 'green' };
    } else {
      if (status === 'unpublic')
        return { result: 'Đang chỉnh sửa', color: 'blue' };
      else if (status === 'unaccepted')
        return { result: 'Đang chờ phê duyệt', color: '#cccc24' };
      else if (status === 'rejected')
        return { result: 'Đã bị từ chối phê duyệt', color: 'orange' };
    }
  }
}

export {
  getCourseStatus,
}