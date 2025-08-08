import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  // Kết nối Socket.IO
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.isConnected) {
        resolve();
        return;
      }

      this.socket = io('http://localhost:5000', {
        auth: {
          token: token
        }
      });

      this.socket.on('connect', () => {
        console.log('Socket.IO connected');
        this.isConnected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        this.isConnected = false;
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
        this.isConnected = false;
      });
    });
  }

  // Ngắt kết nối
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Lắng nghe notification mới
  onNewNotification(callback: (notification: any) => void): void {
    if (this.socket) {
      this.socket.on('new_notification', callback);
    }
  }

  // Hủy lắng nghe notification
  offNewNotification(): void {
    if (this.socket) {
      this.socket.off('new_notification');
    }
  }

  // Kiểm tra trạng thái kết nối
  isSocketConnected(): boolean {
    return this.isConnected && this.socket !== null;
  }

  // Lấy instance socket
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketService(); 