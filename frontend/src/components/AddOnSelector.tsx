import React from 'react';
import { SelectedAddOn } from '../types';
import { formatINR, convertUSDToINR } from '../utils/currency';

interface AddOnSelectorProps {
  addOns: SelectedAddOn[];
  onAddOnToggle: (addOnId: string) => void;
}

export const AddOnSelector: React.FC<AddOnSelectorProps> = ({
  addOns,
  onAddOnToggle,
}) => {
  if (addOns.length === 0) {
    return (
      <div className="no-addons">
        <p>No add-ons available for this item.</p>
      </div>
    );
  }

  return (
    <div className="addon-selector">
      <div className="addon-grid">
        {addOns.map(({ addOn, selected }) => (
          <div
            key={addOn.id}
            className={`addon-card ${selected ? 'selected' : ''}`}
            onClick={() => onAddOnToggle(addOn.id)}
          >
            <div className="addon-checkbox">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onAddOnToggle(addOn.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="addon-info">
              <h4 className="addon-name">{addOn.name}</h4>
              {addOn.description && (
                <p className="addon-description">{addOn.description}</p>
              )}
              <span className="addon-price">+{formatINR(convertUSDToINR(addOn.price))}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="addon-summary">
        <h4>Selected Add-ons:</h4>
        {addOns.filter(item => item.selected).length === 0 ? (
          <p className="no-selection">No add-ons selected</p>
        ) : (
          <ul className="selected-addons">
            {addOns
              .filter(item => item.selected)
              .map(({ addOn }) => (
                <li key={addOn.id} className="selected-addon">
                  <span>{addOn.name}</span>
                  <span>+{formatINR(convertUSDToINR(addOn.price))}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
