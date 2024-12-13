/**
 * 日期时间工具类
 */
export class DateTimeUtils {
  /**
   * 格式化日期时间
   * @param date 日期对象或时间戳
   * @param format 格式字符串 (yyyy-MM-dd HH:mm:ss)
   */
  static format(date: Date | number | string, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }

    const padZero = (num: number) => String(num).padStart(2, '0');

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, match => {
      switch (match) {
        case 'yyyy':
          return String(d.getFullYear());
        case 'MM':
          return padZero(d.getMonth() + 1);
        case 'dd':
          return padZero(d.getDate());
        case 'HH':
          return padZero(d.getHours());
        case 'mm':
          return padZero(d.getMinutes());
        case 'ss':
          return padZero(d.getSeconds());
        default:
          return match;
      }
    });
  }

  /**
   * 获取相对时间描述
   * @param date 日期对象或时间戳
   * @returns 相对时间描述
   */
  static getRelativeTime(date: Date | number | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }

    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}天前`;
    }
    if (hours > 0) {
      return `${hours}小时前`;
    }
    if (minutes > 0) {
      return `${minutes}分钟前`;
    }
    return '刚刚';
  }

  /**
   * 判断是否是同一天
   * @param date1 第一个日期
   * @param date2 第二个日期
   */
  static isSameDay(date1: Date | number | string, date2: Date | number | string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  /**
   * 获取日期范围
   * @param start 开始日期
   * @param end 结束日期
   * @returns 日期数组
   */
  static getDateRange(start: Date | number | string, end: Date | number | string): Date[] {
    const dates: Date[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date range:', { start, end });
      return dates;
    }

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  /**
   * 添加时间
   * @param date 基准日期
   * @param amount 添加的数量
   * @param unit 时间单位 ('year'|'month'|'day'|'hour'|'minute'|'second')
   */
  static add(
    date: Date | number | string,
    amount: number,
    unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
  ): Date {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date);
      return new Date();
    }

    switch (unit) {
      case 'year':
        d.setFullYear(d.getFullYear() + amount);
        break;
      case 'month':
        d.setMonth(d.getMonth() + amount);
        break;
      case 'day':
        d.setDate(d.getDate() + amount);
        break;
      case 'hour':
        d.setHours(d.getHours() + amount);
        break;
      case 'minute':
        d.setMinutes(d.getMinutes() + amount);
        break;
      case 'second':
        d.setSeconds(d.getSeconds() + amount);
        break;
    }

    return d;
  }
}
