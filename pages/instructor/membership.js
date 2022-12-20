import Image from 'next/image';
import { useState } from 'react';
import InstructorRoute from '../../components/routes/InstructorRoute';
import ModalPaymentOption from '../../components/forms/ModalPaymentOption';
import styles from '../../styles/components/instructor/Membership.module.scss';

const MembershipPage = () => {
  // states
  const [modalPaymentOption, setModalPaymentOption] = useState({ opened: false, price: 0 });

  // functions
  const onCardClick = async (type) => {
    setModalPaymentOption({
      ...modalPaymentOption,
      opened: true,
      price: type === 'silver' ? 1490000 : type === 'gold' ? 2980000 : type === 'premium' ? 5960000 : 0
    });
  }

  return (
    <InstructorRoute hideSidebar={false}>
      <div
        className={styles.container}
      >
        <h2
          className={styles.h2}
        >Thành viên của nextgoal</h2>
        <div
          className={`${styles.container_body} ${styles.d_flex_row}`}
          style={{ gap: '64px', justifyContent: 'center' }}
        >
          <div style={{ marginTop: '128px' }}>
            <PlanCard type='silver' onCardClick={() => onCardClick('silver')}/>
          </div>
          <div style={{ marginTop: '0px' }}>
            <PlanCard type='premium' onCardClick={() => onCardClick('premium')}/>
          </div>
          <div style={{ marginTop: '128px' }}>
            <PlanCard type='gold' onCardClick={() => onCardClick('gold')}/>
          </div>
        </div>

        <ModalPaymentOption
          modalPaymentOption={modalPaymentOption}
          setModalPaymentOption={setModalPaymentOption}
        />
      </div>
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