package <%= appPackage %>;


public class Library {
    private static Library ourInstance = new Library();

    public static Library getInstance() {
        return ourInstance;
    }

    private static String HELLO = "Hello world!";

    private Library() {
    }

    public String getHello() {
        return HELLO;
    }
}
