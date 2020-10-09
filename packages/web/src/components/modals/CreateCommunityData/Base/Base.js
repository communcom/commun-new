import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Input } from '@commun/ui';

import { SYSTEM_COMMUNITY_NAMES } from 'shared/constants';
import { useTranslation } from 'shared/i18n';

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
  justify-content: flex-end;
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
  next,
}) {
  const { t } = useTranslation();
  const [hasNameError, setHasNameError] = useState(false);
  const [hasDescriptionError, setHasDescriptionError] = useState(false);

  const onCoverUpdate = url => {
    setCover(url);
  };

  const onAvatarUpdate = url => {
    setAvatar(url);
  };

  const onNameChange = e => {
    const { value } = e.target;
    const nextValue = name ? value : value.trim();

    if (SYSTEM_COMMUNITY_NAMES.includes(nextValue.toLowerCase())) {
      setHasNameError(true);
    } else if (hasNameError) {
      setHasNameError(false);
    }

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

  const isDisabled = !name || hasNameError || !language;

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
          <ChooseLanguageStyled language={language} onSelect={onLanguageChange} />
        </InputsWrapper>
      </Content>

      <ButtonsStyled>
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
  next: PropTypes.func.isRequired,
};

Base.defaultProps = {
  coverUrl: '',
  avatarUrl: '',
  name: '',
  description: '',
  language: null,
};
