package com.ssm.model;

import java.awt.print.Book;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.List;

public class UserInfo implements Serializable {
    private String id;
    private String name;
    private List<Book> books;

    @Override
    protected Object clone() throws CloneNotSupportedException {
//        OutputStream os =
//        ObjectOutputStream objectOutputStream = new ObjectOutputStream();
//        ByteArrayInputStream bis = new ByteArrayInputStream();
//        ObjectInputStream ois = new ObjectInputStream();
          ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try {
            ObjectOutputStream oos = new ObjectOutputStream(bos);
            oos.writeObject(this);

            ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
            ObjectInputStream ois = new ObjectInputStream(bis);
            UserInfo userInfo = (UserInfo) ois.readObject();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
