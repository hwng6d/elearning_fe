import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

const SearchBar = ({
  styles: { width, height },
  field,
  onSearchClick,
  value,
  setValue
}) => {
  const onSearchBarChange = (e) => {
    setValue({...value, [e.target.name]: e.target.value});
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
      {/* left */}
      <div style={{ width: '90%' }}>
        <Input
          name={field}
          value={value[`${field}`]}
          onChange={onSearchBarChange}
          onPressEnter={onSearchClick}
          placeholder='Nhập tìm kiếm...'
          allowClear={true}
          style={{ height: '100%', border: 'none' }}
        />
      </div>
      {/* right */}
      <div
        style={{
          width: '10%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          margin: '8px',
          cursor: 'pointer'
        }}
        onClick={onSearchClick}
      >
        <SearchOutlined
          style={{ fontSize: '16px', width: '50%' }}
        />
      </div>
    </div>
  )
}

export default SearchBar;