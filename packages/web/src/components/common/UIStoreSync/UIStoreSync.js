import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';

const ONE_COLUMN_MAX_WIDTH = 750;

@withTheme
export default class UIStoreSync extends PureComponent {
  static propTypes = {
    screenType: PropTypes.string.isRequired,
    isOneColumnMode: PropTypes.bool.isRequired,
    updateUIMode: PropTypes.func.isRequired,
    isDragAndDrop: PropTypes.bool.isRequired,
  };

  dragEnterCounter = 0;

  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('dragenter', this.handleDragEnter);
    window.addEventListener('dragleave', this.handleDragLeave);
  }

  componentWillReceiveProps(nextProps) {
    const { isDragAndDrop } = this.props;

    if (isDragAndDrop !== nextProps.isDragAndDrop) {
      if (nextProps.isDragAndDrop) {
        window.addEventListener('mousemove', this.onMouseMove);
      } else {
        window.removeEventListener('mousemove', this.onMouseMove);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('dragenter', this.handleDragEnter);
    window.removeEventListener('dragleave', this.handleDragLeave);
  }

  onResize = () => {
    const { screenType, isOneColumnMode, updateUIMode, theme } = this.props;
    const width = window.innerWidth;

    const actualIsOneColumnMode = width < ONE_COLUMN_MAX_WIDTH;
    let actualScreenType;

    if (width >= theme.breakpoints.desktop) {
      actualScreenType = 'desktop';
    } else if (width >= theme.breakpoints.tablet) {
      actualScreenType = 'tablet';
    } else if (width >= theme.breakpoints.mobileLandscape) {
      actualScreenType = 'mobileLandscape';
    } else {
      actualScreenType = 'mobile';
    }

    if (actualScreenType !== screenType || actualIsOneColumnMode !== isOneColumnMode) {
      updateUIMode({
        screenType: actualScreenType,
        isOneColumnMode: actualIsOneColumnMode,
      });
    }
  };

  onMouseMove = () => {
    const { isDragAndDrop, updateUIMode } = this.props;

    if (isDragAndDrop) {
      this.dragEnterCounter = 0;

      updateUIMode({
        isDragAndDrop: false,
      });
    }
  };

  handleDragEnter = e => {
    const { isDragAndDrop, updateUIMode } = this.props;

    this.dragEnterCounter += 1;

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0 && !isDragAndDrop) {
      updateUIMode({
        isDragAndDrop: true,
      });
    }
  };

  handleDragLeave = () => {
    const { isDragAndDrop, updateUIMode } = this.props;

    this.dragEnterCounter -= 1;

    if (isDragAndDrop && this.dragEnterCounter === 0) {
      updateUIMode({
        isDragAndDrop: false,
      });
    }
  };

  render() {
    return null;
  }
}
