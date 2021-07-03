import { v4 } from 'uuid';

export default class UuidUtil {
  static random(): string {
    return v4();
  }

  static mock(): string {
    return 'de1a2ef9-a1e0-47aa-acd0-523f184262b3';
  }
}
