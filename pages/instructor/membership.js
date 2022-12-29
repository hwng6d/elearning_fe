import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import InstructorRoute from '../../components/routes/InstructorRoute';
import ModalPaymentOption from '../../components/forms/ModalPaymentOption';
import { Context } from '../../context';
import styles from '../../styles/components/instructor/Membership.module.scss';

const MembershipPage = () => {
  // global context
  const { state: { user } } = useContext(Context);

  // states
  const [isAlreadyMembership, setAlreadyMembership] = useState(false);
  const [modalPaymentOption, setModalPaymentOption] = useState({ opened: false, type: '' });

  // functions
  const getMemberShipInfo = () => {
    if (user) {
      if (user?.instructor_information?.plan_start)
        setAlreadyMembership(true);
    }
  }

  const onCardClick = async (type) => {
    setModalPaymentOption({
      ...modalPaymentOption,
      opened: true,
      type
    });
  }

  useEffect(() => {
    getMemberShipInfo();
  }, [user]);

  return (
    <InstructorRoute hideSidebar={false}>
      {
        !isAlreadyMembership
          ? (
            <div
              className={styles.container}
            >
              <h2
                className={styles.h2}
              >Thành viên Instructor của nextgoal</h2>
              <div
                className={`${styles.container_body} ${styles.d_flex_row}`}
                style={{
                  background: `linear-gradient(#ffd247 20%, #ffff 80%)`,
                  marginTop: '32px',
                  gap: '64px',
                  justifyContent: 'center',
                  borderRadius: '20px',
                  border: '10px solid #ffd247'
                }}
              >
                {/* <div style={{ marginTop: '128px' }}>
                  <PlanCard type='silver' onCardClick={() => onCardClick('silver')} />
                </div> */}
                <div style={{ marginTop: '0px' }}>
                  <PlanCard type='premium' onCardClick={() => onCardClick('premium')} />
                </div>
                {/* <div style={{ marginTop: '128px' }}>
                  <PlanCard type='gold' onCardClick={() => onCardClick('gold')} />
                </div> */}
              </div>

              <ModalPaymentOption
                modalPaymentOption={modalPaymentOption}
                setModalPaymentOption={setModalPaymentOption}
              />
            </div>
          )
          : (
            <div>
              <h2>Bạn đã là thành viên membership: {user?.instructor_information?.plan_type?.toUpperCase()}</h2>
            </div>
          )
      }
    </InstructorRoute>
  )
}

export default MembershipPage;

const PlanCard = ({
  type = 'silver', // gold, premium
  onCardClick,
}) => {

  return (
    <div
      className={`${styles.plancard_container} ${styles.d_flex_col}`}
      style={{ border: `1px solid #252526`, cursor: 'pointer' }}
      onClick={onCardClick}
    >
      <div
        className={`${styles.plancard_container_top} ${styles.d_flex_col}`}
        style={{
          background: `linear-gradient(#${type === 'premium' ? 'ffa190' : type === 'silver' ? 'c9d1da' : type === 'gold' ? 'f3c783' : 'ffff'}, #ffff)`
        }}
      >
        <div
          className={`${styles.plancard_container_top_top} ${styles.d_flex_row}`}
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            alt='web_logo'
            src={'/logo.png'}
            width={92} //138
            height={28} //42
            onClick={() => setSearch('')}
          />
        </div>
        <div
          className={`${styles.plancard_container_top_bottom} ${styles.d_flex_col}`}
          style={{ justifyContent: 'center', alignItems: 'center', gap: '20px' }}
        >
          <h3
            style={{ fontSize: '32px' }}
          >
            <b>{type === 'silver' ? '3 tháng' : type === 'gold' ? '6 tháng' : type === 'premium' ? '1 năm' : ''}</b>
          </h3>
          <p
            style={{ fontSize: '18px', textDecoration: 'line-through' }}
          >
            {type === 'silver' ? '1.490.000' : type === 'gold' ? '2.980.000' : type === 'premium' ? '5.960.000' : ''} vnđ
          </p>
          <p
            style={{ fontSize: '18px' }}
          >
            <b>{type === 'silver' ? '990.000' : type === 'gold' ? '2.490.000' : type === 'premium' ? '3.490.000' : ''} vnđ</b>
          </p>
        </div>
      </div>
      <div
        className={`${styles.plancard_container_bottom} ${styles.d_flex_row}`}
        style={{ justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}
      >
        <p><b>{type.toUpperCase()}</b></p>
      </div>
    </div>
  )
}