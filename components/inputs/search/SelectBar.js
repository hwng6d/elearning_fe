import { SearchOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';

const SelectBar = ({
  styles: { width, height },
  field,
  options,
  value,
  setValue
}) => {
  const onSelectBarChange = async (selected) => {
    setValue({...value, [`${field}`]: selected});
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'horizontal',
        border: '2px solid #b0b7bf',
        width,
        height
      }}
    >
      <Select
        value={value[`${field}`]}
        options={options}
        style={{
          width: '100%',
          border: 'none'
        }}
        bordered={false}
        onChange={onSelectBarChange}
      />
    </div>
  )
}

export default SelectBar;