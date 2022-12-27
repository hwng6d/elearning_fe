import dayjs from 'dayjs';

const checkValidMembership = (user) => {
  console.log('user: ', user);

  if (user?.instructor_information?.plan_start) {
    const nowTimestamp = dayjs().valueOf();
    const [plan_type, plan_start] = [user.instructor_information.plan_type, user.instructor_information.plan_start];

    let expiresIn = 0;
    if (plan_type === 'silver')
      expiresIn = dayjs(plan_start).add(3, 'month');
    else if (plan_type === 'gold')
      expiresIn = dayjs(plan_start).add(6, 'month');
    else if (plan_type === 'premium')
      expiresIn = dayjs(plan_start).add(1, 'year');

    if (nowTimestamp <= expiresIn)
      return true;
    else
      return false;
  } else {
    return false;
  }
};

export {
  checkValidMembership,
}