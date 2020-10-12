import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import styled from 'styled-components';

import { Button, Input } from '@commun/ui';

import { SYSTEM_COMMUNITY_NAMES } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';

import ChooseLanguage from 'components/common/ChooseLanguage';
import CoverAvatar from 'components/common/CoverAvatar';
import CoverImage from 'components/common/CoverImage';
import { Buttons, Content, StepInfo, StepName, Wrapper } from '../common.styled';

const ImagesWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const CoverImageStyled = styled(CoverImage)`
  height: 110px;
  min-height: 110px;
  border-radius: 10px;
`;

const CoverAvatarStyled = styled(CoverAvatar)`
  position: absolute;
  width: 80px;
  height: 80px;
  left: 30px;
  bottom: -16px;
  z-index: 1;
`;

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px 0;

  & > :not(:last-child) {
    margin-bottom: 15px;
  }
`;

const ChooseLanguageStyled = styled(ChooseLanguage)`
  border: 1px solid #e2e6e8;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
`;

const ButtonsStyled = styled(Buttons)`
  justify-content: space-between;
`;

export default function Base({
  avatarUrl,
  coverUrl,
  name,
  description,
  language,
  setCover,
  setAvatar,
  setName,
  setDescription,
  setLanguage,
  communityIsExists,
  close,
  next,
}) {
  const { t } = useTranslation();
  const [isProgressing, setIsProgressing] = useState(false);
  const [hasNameError, setHasNameError] = useState(false);
  const [hasDescriptionError, setHasDescriptionError] = useState(false);

  const validateCommunityName = throttle(
    async nextName => {
      setIsProgressing(true);

      if (SYSTEM_COMMUNITY_NAMES.includes(nextName.toLowerCase())) {
        setHasNameError(true);
      }

      try {
        const { isExists } = await communityIsExists({ name: nextName });

        if (isExists) {
          setHasNameError(true);
        } else if (hasNameError) {
          setHasNameError(false);
        }
      } catch (err) {
        setHasNameError(true);
        displayError(err);
      }

      setIsProgressing(false);
    },
    300,
    { leading: false }
  );

  useEffect(() => {
    validateCommunityName(name);
  }, []);

  const onCoverUpdate = url => {
    setCover(url);
  };

  const onAvatarUpdate = url => {
    setAvatar(url);
  };

  const onNameChange = async e => {
    const { value } = e.target;
    const nextValue = name ? value : value.trim();

    validateCommunityName(nextValue);

    setName(nextValue);
  };

  const onDescriptionChange = e => {
    const { value } = e.target;
    const nextValue = name ? value : value.trim();

    if (nextValue.length === 0) {
      setHasDescriptionError(true);
    } else if (hasDescriptionError) {
      setHasDescriptionError(false);
    }

    setDescription(nextValue);
  };

  const onLanguageChange = locale => {
    setLanguage(locale);
  };

  const isDisabled = isProgressing || !name || hasNameError || !language || !avatarUrl || !coverUrl;

  return (
    <Wrapper>
      <Content>
        <StepInfo>
          <StepName>{t('modals.create_community_data.base.title')}</StepName>
        </StepInfo>

        <ImagesWrapper>
          <CoverImageStyled
            coverUrl={coverUrl}
            isCommunityCreation
            editable
            onUpdate={onCoverUpdate}
          />
          <CoverAvatarStyled
            avatarUrl={avatarUrl}
            isCommunity
            isCommunityCreation
            editable
            onUpdate={onAvatarUpdate}
          />
        </ImagesWrapper>

        <InputsWrapper>
          <Input
            title={t('modals.create_community_data.base.name')}
            placeholder={t('modals.create_community_data.base.name_placeholder')}
            value={name}
            isError={hasNameError}
            onChange={onNameChange}
          />
          <Input
            title={t('modals.create_community_data.base.description')}
            placeholder={t('modals.create_community_data.base.description_placeholder')}
            multiline
            value={description}
            isError={hasDescriptionError}
            onChange={onDescriptionChange}
          />
          <ChooseLanguageStyled language={language} onSelect={onLanguageChange} isClosed />
        </InputsWrapper>
      </Content>

      <ButtonsStyled>
        <Button hollow transparent gray medium onClick={close}>
          {t('common.cancel')}
        </Button>
        <Button primary medium disabled={isDisabled} onClick={next}>
          {t('common.next')}
        </Button>
      </ButtonsStyled>
    </Wrapper>
  );
}

Base.propTypes = {
  coverUrl: PropTypes.string,
  avatarUrl: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  language: PropTypes.object,

  setAvatar: PropTypes.func.isRequired,
  setCover: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  communityIsExists: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
};

Base.defaultProps = {
  coverUrl: '',
  avatarUrl: '',
  name: '',
  description: '',
  language: null,
};
