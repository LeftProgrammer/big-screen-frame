interface RGB {
  r: number;
  g: number;
  b: number;
}

export class Color {
  private r: number;
  private g: number;
  private b: number;
  private a: number;

  constructor(color: string) {
    const { r, g, b, a } = this.parseColor(color);
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a ?? 1;
  }

  private parseColor(color: string): RGB & { a?: number } {
    // 处理 hex 格式
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }

    // 处理 rgb/rgba 格式
    if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g)?.map(Number) || [];
      return {
        r: values[0] || 0,
        g: values[1] || 0,
        b: values[2] || 0,
        a: values[3]
      };
    }

    // 默认返回黑色
    return { r: 0, g: 0, b: 0 };
  }

  public toRgb(): RGB {
    return {
      r: this.r,
      g: this.g,
      b: this.b
    };
  }

  public toRgbString(): string {
    return this.a === 1
      ? `rgb(${this.r}, ${this.g}, ${this.b})`
      : `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  public mix(color: string, amount: number): Color {
    const targetColor = new Color(color);
    const target = targetColor.toRgb();

    return new Color(
      `rgb(${Math.round(this.r + (target.r - this.r) * amount)}, ${Math.round(
        this.g + (target.g - this.g) * amount
      )}, ${Math.round(this.b + (target.b - this.b) * amount)})`
    );
  }
}

// 添加到全局 window 对象
declare global {
  interface Window {
    Color: typeof Color;
  }
}

window.Color = Color;
