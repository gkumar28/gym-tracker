package com.gymtracker.mapper;

import com.gymtracker.entity.Set;
import com.gymtracker.schemaobject.SetSO;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SetMapperTest {

    @Test
    void testToSO() {
        Set set = new Set(10, 100.0, 60, "Good set");
        SetSO so = SetMapper.toSO(set);

        assertNotNull(so);
        assertEquals(10, so.getReps());
        assertEquals(100.0, so.getWeight());
        assertEquals(60, so.getRestSeconds());
        assertEquals("Good set", so.getNotes());
    }

    @Test
    void testToSO_Null() {
        SetSO so = SetMapper.toSO(null);
        assertNull(so);
    }

    @Test
    void testToEntity() {
        SetSO so = new SetSO(10, 100.0, 60, "Good set");
        Set set = SetMapper.toEntity(so);

        assertNotNull(set);
        assertEquals(10, set.getReps());
        assertEquals(100.0, set.getWeight());
        assertEquals(60, set.getRestSeconds());
        assertEquals("Good set", set.getNotes());
    }

    @Test
    void testToEntity_Null() {
        Set set = SetMapper.toEntity(null);
        assertNull(set);
    }

    @Test
    void testToSOList() {
        List<Set> sets = Arrays.asList(
            new Set(10, 100.0, 60, "Set 1"),
            new Set(8, 110.0, 90, "Set 2")
        );

        List<SetSO> setSOs = SetMapper.toSOList(sets);

        assertNotNull(setSOs);
        assertEquals(2, setSOs.size());
        assertEquals(10, setSOs.get(0).getReps());
        assertEquals(8, setSOs.get(1).getReps());
    }

    @Test
    void testToSOList_Null() {
        List<SetSO> setSOs = SetMapper.toSOList(null);
        assertNull(setSOs);
    }

    @Test
    void testToEntityList() {
        List<SetSO> setSOs = Arrays.asList(
            new SetSO(10, 100.0, 60, "Set 1"),
            new SetSO(8, 110.0, 90, "Set 2")
        );

        List<Set> sets = SetMapper.toEntityList(setSOs);

        assertNotNull(sets);
        assertEquals(2, sets.size());
        assertEquals(10, sets.get(0).getReps());
        assertEquals(8, sets.get(1).getReps());
    }

    @Test
    void testToEntityList_Null() {
        List<Set> sets = SetMapper.toEntityList(null);
        assertNull(sets);
    }
}

