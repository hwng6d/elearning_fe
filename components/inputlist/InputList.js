import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag } from 'antd';

const InputList = ({
  maxLength = 10,
  value,
  type,
  formValues,
  setFormValues,
  scopeStyle,
  cellStyle,
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, []);

  const handleClose = (removedTag) => {
    const newTags = formValues[`${value}`].filter((tag) => tag !== removedTag);
    setFormValues({ ...formValues, [`${value}`]: newTags });
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && formValues[`${value}`].indexOf(inputValue) === -1) {
      setFormValues({ ...formValues, [`${value}`]: [...formValues[`${value}`], inputValue] });
    }
    setInputVisible(false);
    setInputValue('');
  };

  const tagChild = formValues[`${value}`]?.map((tag) => {
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        <Tag
          closable
          onClose={(e) => {
            e.preventDefault();
            handleClose(tag);
          }}
          style={{
            ...cellStyle,
            display: 'flex',
            padding: '4px 16px',
            fontSize: '14px',
            marginBottom: '12px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {tag}
        </Tag>
      </span>
    );
  });

  return (
    <div style={{...scopeStyle}}>
      <div>
        {tagChild}
      </div>
      {inputVisible && type === 'textbox' && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{...cellStyle, padding: '4px 8px', fontSize: '14px'}}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && formValues[`${value}`]?.length < maxLength && (
        <Tag
          onClick={showInput} className="site-tag-plus"
          style={{...cellStyle, padding: '4px 16px', fontSize: '14px'}}
        >
          <PlusOutlined /> Thêm
        </Tag>
      )}
    </div>
  );
};

export default React.memo(InputList);