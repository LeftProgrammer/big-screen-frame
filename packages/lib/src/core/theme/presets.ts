import type { ThemeVars } from './types';

export const defaultTheme: ThemeVars = {
  bsf: {
    colors: {
      primary: '#409EFF',
      success: '#67C23A',
      warning: '#E6A23C',
      danger: '#F56C6C',
      info: '#909399',
      text: {
        primary: '#303133',
        regular: '#606266',
        secondary: '#909399',
        placeholder: '#C0C4CC'
      },
      border: {
        base: '#DCDFE6',
        light: '#E4E7ED',
        lighter: '#EBEEF5',
        extra_light: '#F2F6FC'
      },
      background: {
        base: '#FFFFFF',
        light: '#F5F7FA',
        lighter: '#FAFAFA'
      },
      chart: [
        '#5470C6',
        '#91CC75',
        '#FAC858',
        '#EE6666',
        '#73C0DE',
        '#3BA272',
        '#FC8452',
        '#9A60B4',
        '#EA7CCC'
      ]
    },
    sizes: {
      font: {
        xs: '12px',
        sm: '13px',
        base: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        base: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px'
      },
      radius: {
        sm: '2px',
        base: '4px',
        lg: '8px',
        round: '20px',
        circle: '100%'
      }
    },
    effects: {
      shadow: {
        base: '0 2px 4px rgba(0, 0, 0, 0.12)',
        light: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
        dark: '0 2px 16px 0 rgba(0, 0, 0, 0.2)'
      },
      border: {
        decoration: {
          color: 'rgba(64, 158, 255, 0.6)',
          glow: '0 0 10px rgba(64, 158, 255, 0.4)'
        }
      },
      transition: {
        fast: 'all 0.2s ease-in-out',
        base: 'all 0.3s ease-in-out',
        slow: 'all 0.4s ease-in-out'
      }
    }
  }
};

export const darkTheme: ThemeVars = {
  bsf: {
    colors: {
      primary: '#409EFF',
      success: '#67C23A',
      warning: '#E6A23C',
      danger: '#F56C6C',
      info: '#909399',
      text: {
        primary: '#E5EAF3',
        regular: '#CFD3DC',
        secondary: '#A3A6AD',
        placeholder: '#8D9095'
      },
      border: {
        base: '#4C4D4F',
        light: '#363637',
        lighter: '#2B2B2C',
        extra_light: '#1F1F1F'
      },
      background: {
        base: '#141414',
        light: '#1F1F1F',
        lighter: '#262727'
      },
      chart: [
        '#5470C6',
        '#91CC75',
        '#FAC858',
        '#EE6666',
        '#73C0DE',
        '#3BA272',
        '#FC8452',
        '#9A60B4',
        '#EA7CCC'
      ]
    },
    sizes: {
      font: {
        xs: '12px',
        sm: '13px',
        base: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        base: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px'
      },
      radius: {
        sm: '2px',
        base: '4px',
        lg: '8px',
        round: '20px',
        circle: '100%'
      }
    },
    effects: {
      shadow: {
        base: '0 2px 4px rgba(0, 0, 0, 0.3)',
        light: '0 2px 12px 0 rgba(0, 0, 0, 0.2)',
        dark: '0 2px 16px 0 rgba(0, 0, 0, 0.4)'
      },
      border: {
        decoration: {
          color: 'rgba(64, 158, 255, 0.4)',
          glow: '0 0 10px rgba(64, 158, 255, 0.3)'
        }
      },
      transition: {
        fast: 'all 0.2s ease-in-out',
        base: 'all 0.3s ease-in-out',
        slow: 'all 0.4s ease-in-out'
      }
    }
  }
};
