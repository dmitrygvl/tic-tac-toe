import React, { FC } from 'react';
import './ServerWentDownModal.css';

const ServerWentDownModal: FC = () => (
  <>
    <div className="modal-backdrop"></div>
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      style={{ display: 'block' }}
    >
      <div className="modal__dialog modal-dialog">
        <div className="modal-dialog__content modal-content">
          <div className="modal-content__header">The server went down</div>
          <div className="modal-content__body">
            Please, try to connect later.
          </div>
        </div>
      </div>
    </div>
  </>
);

export default ServerWentDownModal;
