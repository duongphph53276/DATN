import React from 'react';

interface VariantAttribute {
  attribute_id: string;
  value_id: string;
  attribute_name: string;
  value: string;
}

interface VariantAttributesDisplayProps {
  variant: {
    attributes: VariantAttribute[];
  } | null;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'purple' | 'blue' | 'green';
  showIcon?: boolean;
}

const VariantAttributesDisplay: React.FC<VariantAttributesDisplayProps> = ({
  variant,
  size = 'md',
  theme = 'purple',
  showIcon = true
}) => {
  if (!variant || !variant.attributes || variant.attributes.length === 0) {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    return <span className={`text-gray-400 ${sizeClasses[size]}`}>Phiên bản cơ bản</span>;
  }

  const getAttributeDisplayName = (attributeName: string) => {
    const attributeMap: { [key: string]: string } = {
      'size': 'Kích thước',
      'color': 'Màu sắc',
      'material': 'Chất liệu',
      'style': 'Kiểu dáng',
      'brand': 'Thương hiệu',
      'weight': 'Trọng lượng',
      'dimension': 'Kích thước',
      'pattern': 'Họa tiết',
      'type': 'Loại',
      'model': 'Mẫu mã',
      'series': 'Dòng sản phẩm'
    };
    return attributeMap[attributeName.toLowerCase()] || attributeName;
  };

  const themeClasses = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const icon = showIcon ? '🎀 ' : '';

  return (
    <div className={`mt-${size === 'sm' ? '1' : '2'}`}>
      {variant.attributes.map((attr: VariantAttribute, index: number) => (
        <span 
          key={index} 
          className={`inline-block ${themeClasses[theme]} ${sizeClasses[size]} rounded-full mr-2 mb-1`}
        >
          {icon}{getAttributeDisplayName(attr.attribute_name)}: {attr.value}
        </span>
      ))}
    </div>
  );
};

export default VariantAttributesDisplay;
