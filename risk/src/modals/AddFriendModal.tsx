import React, { useState } from 'react';
import "./styles/AddFriendModal.css";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (friendInfo: string, canSeeRealName: boolean) => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [friendInfo, setFriendInfo] = useState('');
  const [canSeeRealName, SetCanSeeRealName] = useState(false);

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFriendInfo(event.target.value);
  };

  const handleSendWithRealNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    SetCanSeeRealName(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(friendInfo, canSeeRealName);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        {/* <svg
           xmlns="http://www.w3.org/2000/svg"
           className="close-button"
           width="40"
           height="40"
           viewBox="0 0 30 30"
           fill="none"
           onClick={onClose} // Close the modal when the SVG icon is clicked
           >
           <path
             d="M19.0233 20.9795L19.3768 20.626L19.0233 20.2724L13.7518 15.001L19.0233 9.72953L19.3768 9.37598L19.0233 9.02242L17.6973 7.69645L17.3437 7.34289L16.9902 7.69645L10.0392 14.6474L9.68567 15.001L10.0392 15.3545L16.9902 22.3055L17.3437 22.6591L17.6973 22.3055L19.0233 20.9795ZM3.3125 15.001C3.3125 8.54645 8.54548 3.31348 15 3.31348C21.4545 3.31348 26.6875 8.54645 26.6875 15.001C26.6875 21.4555 21.4545 26.6885 15 26.6885C8.54548 26.6885 3.3125 21.4555 3.3125 15.001Z"
             fill="#FFE095"
             stroke="black"
             />
             </svg> */}
        <header className="modal-card-head">
          <p className="modal-card-title">SEND FRIEND REQUEST</p>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">search by username or email</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="enter username or email"
                  value={friendInfo}
                  onChange={handleSearchQueryChange}
                />
              </div>
            </div>
            <label className="or-option">
                or
            </label>
            <div className="field">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={canSeeRealName}
                  onChange={handleSendWithRealNameChange}
                />{' '}
                send with real name
              </label>
            </div>
            <div className="button-container">
              <button type="submit" className="send-request-button">send request</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AddFriendModal;