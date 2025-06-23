import * as SignalR from "@microsoft/signalr";

const API_URL = process.env.EXPO_PUBLIC_SIGNALR_URL; 

class NotificationSignalRService {
  private connection: SignalR.HubConnection | null = null;
  private isConnecting: boolean = false;
  private connectionPromise: Promise<void> | null = null;
  private activeListeners: number = 0;
  private currentToken: string | null = null;
  private isInitialized: boolean = false;
  public onUnreadCountChange?: (count: number) => void;
  private notificationDeletedCallbacks: ((notification: any) => void)[] = [];
  // Kiểm tra xem connection có đang hoạt động không
  isConnected(): boolean {
    return this.connection?.state === SignalR.HubConnectionState.Connected;
  }

  // Lấy trạng thái hiện tại của connection
  getConnectionState(): string {
    if (!this.connection) return 'Disconnected';
    return SignalR.HubConnectionState[this.connection.state];
  }

  // Kiểm tra và kết nối lại nếu cần
  async checkAndReconnect() {
    if (!this.isConnected() && this.currentToken) {
      console.log('Connection lost, attempting to reconnect...');
      await this.start(this.currentToken);
    }
  }

  async start(userToken: string) {
    // Nếu đang kết nối thì return promise hiện tại
    if (this.isConnecting) {
      return this.connectionPromise;
    }

    // Nếu đã có kết nối thì return
    if (this.isConnected()) {
      this.activeListeners++;
      return;
    }

    try {
      this.isConnecting = true;
      this.activeListeners++;
      this.currentToken = userToken;

      // Tạo promise mới cho lần kết nối này
      this.connectionPromise = this.initializeConnection(userToken);
      await this.connectionPromise;
      this.isInitialized = true;
    } finally {
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  private async initializeConnection(userToken: string) {
    // Nếu có connection cũ thì stop trước
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }

    this.connection = new SignalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/notificationHub`, {
        accessTokenFactory: () => userToken,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
      .build();

    // Đăng ký event handler cho thông báo mới
    this.connection.on("ReceiveUnreadCount", (unreadCount: number) => {
      console.log("Received unread count server gui:", unreadCount);
      if (this.onUnreadCountChange) {
        this.onUnreadCountChange(unreadCount);
      }
    });

    this.connection.on("NotificationDeleted", (notification: any) => {
      this.notificationDeletedCallbacks.forEach(cb => cb(notification));
    })

    // Xử lý các sự kiện connection
    this.connection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      // Chỉ thử kết nối lại nếu đã được khởi tạo và vẫn còn listeners
      if (this.isInitialized && this.activeListeners > 0 && this.currentToken) {
        console.log("Attempting to reconnect...");
        this.start(this.currentToken);
      }
    });

    this.connection.onreconnecting((error) => {
      console.log("SignalR reconnecting:", error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
    });

    try {
      await this.connection.start();
      console.log("SignalR Connected to Notification Hub");
    } catch (error) {
      console.error("Error starting SignalR connection:", error);
      throw error;
    }
  }

  onDeleteNotification(callback: (notification: any) => void) {
    this.notificationDeletedCallbacks.push(callback);
  }

  removeDeleteNotificationCallback(callback: (notification: any) => void) {
    this.notificationDeletedCallbacks = this.notificationDeletedCallbacks.filter(cb => cb !== callback);
  }

  async stop() {
    // this.activeListeners--;
    
    // Chỉ stop connection khi không còn listener nào và đã được khởi tạo
    if (this.activeListeners <= 0 && this.isInitialized) {
      if (this.connection) {
        try {
          // Đợi connection hiện tại hoàn thành nếu đang kết nối
          if (this.isConnecting && this.connectionPromise) {
            await this.connectionPromise;
          }
          await this.connection.stop();
        } catch (error) {
          console.error("Error stopping SignalR connection:", error);
        } finally {
          this.connection = null;
          this.activeListeners = 0;
          this.currentToken = null;
          this.isInitialized = false;
        }
      }
    }
  }

  // Reset số lượng listeners về 0
  resetListeners() {
    this.activeListeners = 0;
  }
}

export const notificationSignalRService = new NotificationSignalRService();

 