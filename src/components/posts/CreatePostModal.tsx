import React, { useState, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { addPost } from '../../store/slices/postSlice';
import { setCreatePostOpen, showToast } from '../../store/slices/uiSlice';
import { postService } from '../../services/postService';
import { MOCK_HASHTAGS } from '../../mock/mockData';
import { MOCK_USERS } from '../../mock/mockData';
import type { PrivacyType } from '../../types';
import { PRIVACY_OPTIONS } from '../../constants/apiEndpoints';

const CreatePostModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState<PrivacyType>('PUBLIC');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [allowedUserIds, setAllowedUserIds] = useState<number[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const valid = files.filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    setMediaFiles((prev) => [...prev, ...valid]);
    valid.forEach((f) => {
      const url = URL.createObjectURL(f);
      setPreviews((prev) => [...prev, url]);
    });
  }, []);

  const removeFile = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    setMediaFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, '').toLowerCase();
    if (tag && !hashtags.includes(tag)) {
      setHashtags((h) => [...h, tag]);
    }
    setHashtagInput('');
  };

  const removeHashtag = (tag: string) => setHashtags((h) => h.filter((t) => t !== tag));

  const toggleAllowedUser = (uid: number) => {
    setAllowedUserIds((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (mediaFiles.length === 0) {
      dispatch(showToast({ message: 'Please add at least one image or video', type: 'error' }));
      return;
    }
    setIsSubmitting(true);
    try {
      const post = await postService.createPost({
        user_id: user.id,
        caption,
        privacy,
        hashtags,
        allowed_user_ids: privacy === 'CUSTOM' ? allowedUserIds : undefined,
        media_files: mediaFiles,
      });
      dispatch(addPost(post));
      dispatch(setCreatePostOpen(false));
      dispatch(showToast({ message: 'Post created successfully!', type: 'success' }));
      // cleanup
      previews.forEach((u) => URL.revokeObjectURL(u));
    } catch (err: unknown) {
      dispatch(showToast({ message: err instanceof Error ? err.message : 'Failed to create post', type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ic-modal-overlay" onClick={() => dispatch(setCreatePostOpen(false))}>
      <div className="ic-modal create-post-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-ic">
          <h6 className="fw-bold mb-0">Create New Post</h6>
          <button
            className="btn-outline-ic"
            style={{ border: 'none', fontSize: '1.2rem', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => dispatch(setCreatePostOpen(false))}
          >
            <i className="bi bi-x" />
          </button>
        </div>

        <div className="p-3">
          {/* Media Upload */}
          <div
            className={`media-dropzone ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFiles(Array.from(e.dataTransfer.files));
            }}
            onClick={() => fileRef.current?.click()}
          >
            <i className="bi bi-cloud-upload display-4 text-ic-muted mb-2" />
            <p className="text-ic-secondary mb-1">Drag & drop photos or videos</p>
            <small className="text-ic-muted">or click to browse</small>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
            />
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="media-preview-grid">
              {previews.map((url, i) => (
                <div key={i} className="media-preview-item">
                  {mediaFiles[i]?.type.startsWith('video') ? (
                    <video src={url} />
                  ) : (
                    <img src={url} alt={`preview-${i}`} />
                  )}
                  <button className="remove-btn" onClick={() => removeFile(i)}>
                    <i className="bi bi-x" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Caption */}
          <textarea
            className="ic-input mt-3"
            rows={3}
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={2200}
            style={{ resize: 'none' }}
          />
          <div className="text-end">
            <small className="text-ic-muted">{caption.length}/2200</small>
          </div>

          {/* Hashtags */}
          <div className="mt-2">
            <div className="d-flex gap-2">
              <input
                className="ic-input"
                placeholder="#hashtag"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
              />
              <button className="btn-outline-ic" onClick={addHashtag} style={{ whiteSpace: 'nowrap' }}>
                Add
              </button>
            </div>
            {/* Suggestions */}
            <div className="d-flex flex-wrap gap-1 mt-1">
              {MOCK_HASHTAGS.slice(0, 5).map((h) => (
                <span
                  key={h.id}
                  className="hashtag-pill"
                  style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                  onClick={() => !hashtags.includes(h.tag) && setHashtags((t) => [...t, h.tag])}
                >
                  #{h.tag}
                </span>
              ))}
            </div>
            {/* Selected hashtags */}
            {hashtags.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="hashtag-pill"
                    onClick={() => removeHashtag(tag)}
                    style={{ cursor: 'pointer' }}
                  >
                    #{tag} <i className="bi bi-x" />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Privacy */}
          <div className="d-flex align-items-center gap-2 mt-3">
            <label style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', flexShrink: 0 }}>
              Privacy:
            </label>
            <select
              className="privacy-select flex-1"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as PrivacyType)}
            >
              {PRIVACY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Users — only for CUSTOM privacy */}
          {privacy === 'CUSTOM' && (
            <div className="mt-3">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                Select allowed users:
              </p>
              <div style={{ maxHeight: 160, overflowY: 'auto' }}>
                {MOCK_USERS.map((u) => (
                  <div
                    key={u.id}
                    className="d-flex align-items-center gap-2 py-1 cursor-pointer"
                    onClick={() => toggleAllowedUser(u.id)}
                  >
                    <input
                      type="checkbox"
                      checked={allowedUserIds.includes(u.id)}
                      readOnly
                      className="form-check-input"
                    />
                    <img
                      src={u.profile_pic || ''}
                      alt={u.username}
                      className="ic-avatar ic-avatar-sm"
                    />
                    <span style={{ fontSize: '0.88rem' }}>{u.full_name}</span>
                    <small className="text-ic-muted">@{u.username}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            className="btn-brand w-100 mt-3 py-2"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Sharing...
              </>
            ) : (
              <>
                <i className="bi bi-share me-2" />
                Share Post
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
